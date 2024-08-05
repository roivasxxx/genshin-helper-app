import Agenda from "agenda";
import payload from "payload";
import { GenshinAccount } from "../types/payload-types";
import { wishImporter } from "./api/wishes/importer";
import { mongoClient } from "./mongo";
import { WISH_REGIONS } from "./constants";
import { NotificationConfig } from "../types/types";
import { notifyUsers } from "./notifications";

require("dotenv").config();

let agenda: Agenda;

async function defineNotificationJobs() {
    agenda.define("sendNotifications", async (job, done) => {
        await notifyUsers();
        done();
    });

    const notifyJob = agenda.create("sendNotifications", {});
    notifyJob.repeatEvery("0 20 * * *", {
        timezone: "Europe/Berlin",
    });
    await notifyJob.save();
}

const initAgenda = async () => {
    const mongoConnectionString = process.env.AGENDA_URI;
    agenda = new Agenda({
        db: {
            address: mongoConnectionString,
        },
    });

    agenda.on("ready", async () => {
        try {
            console.log("Setting up agenda jobs...");
            agenda.define(
                "wishImporter",
                { shouldSaveResult: false, concurrency: 10 },
                async (job, done) => {
                    const jobAttributes: {
                        cmsJob: string;
                        account: GenshinAccount;
                        link: string;
                    } = job.attrs.data as any;

                    const cmsJobId = jobAttributes.cmsJob;
                    const region =
                        (jobAttributes.account.region as WISH_REGIONS) ||
                        WISH_REGIONS.EUROPE;

                    try {
                        let isValid = await isCmsJobValid(cmsJobId);
                        if (!isValid) {
                            console.error("Invalid job: " + cmsJobId);
                            throw new Error("Invalid job: " + cmsJobId);
                        }
                        // mark job as in progress
                        await payload.update({
                            collection: "jobs",
                            id: cmsJobId,
                            data: {
                                status: "IN_PROGRESS",
                            },
                        });
                        // this will come from jobAttributes.link !!!!
                        const link = jobAttributes.link;

                        const account = jobAttributes.account;
                        let lastIds = account.wishInfo;
                        // process history
                        const result = await wishImporter(
                            link,
                            account.id,
                            lastIds,
                            region
                        );
                        // check if there was an error
                        const hasError = !result;

                        if (hasError) {
                            // if there was an error, mark job as failed, abort import
                            console.error("Wish processing failed..");
                            throw new Error("Wish processing failed.");
                        }

                        // check if job is still valid after processing is done
                        isValid = await isCmsJobValid(cmsJobId);
                        if (!isValid) {
                            console.error(
                                "Invalid job, abort updating wishInfo, abort importing wish history"
                            );
                            throw new Error(
                                "Invalid job, abort updating wishInfo, abort importing wish history"
                            );
                        }

                        const db = mongoClient.db("electro");
                        const collection = db.collection("genshin-wishes");
                        for (const key of Object.keys(result)) {
                            // need to insert with mongo, because payload doesn't support bulk insert
                            const wishes = result[key].wishes;
                            if (Array.isArray(wishes) && wishes.length > 0) {
                                // wishes for a banner might be empty, insertMany expects non-empty array
                                await collection.insertMany(result[key].wishes);
                            }
                        }
                        // update account
                        await payload.update({
                            id: jobAttributes.account.id,
                            collection: "genshin-accounts",
                            data: {
                                importJob: "",
                                wishInfo: {
                                    ...lastIds,
                                    lastUpdate: new Date().toISOString(),
                                },
                            },
                        });
                        // update job
                        await payload.update({
                            collection: "jobs",
                            id: cmsJobId,
                            data: {
                                status: "COMPLETED",
                            },
                        });
                    } catch (error) {
                        console.error("WISH IMPORT ERROR: ", error);
                        // mark job as failed
                        try {
                            await payload.update({
                                collection: "jobs",
                                id: cmsJobId,
                                data: {
                                    status: "FAILED",
                                },
                            });
                            await payload.update({
                                id: jobAttributes.account.id,
                                collection: "genshin-accounts",
                                data: {
                                    importJob: "",
                                },
                            });
                        } catch (e) {}
                        job.fail(error);
                        done();
                        return;
                    }

                    console.log("Done with job: ", cmsJobId);
                    done();
                }
            );
            // remove existing jobs
            const jobs = await agenda.jobs();
            for (const job of jobs) {
                await job.remove();
            }
            // create new ones
            await defineNotificationJobs();

            await agenda.start();
        } catch (error) {
            console.error("Error in initAgenda: ", error);
        }
    });
};

const isCmsJobValid = async (cmsJobId: string) => {
    try {
        const jobStatus = await payload.findByID({
            collection: "jobs",
            id: cmsJobId,
        });
        // check if cms job was cancelled
        if (jobStatus.status === "CANCELLED") {
            // throw error
            throw new Error(`Job cancelled.`);
        }
    } catch (error) {
        // if any error is thrown -> job is not valid, return false
        console.error("CMS job is not valid: ", error);
        return false;
    }
    return true;
};

export { agenda, initAgenda };
