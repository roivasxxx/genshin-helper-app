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

const notifyConfig: NotificationConfig[] = [
    {
        // 6 am in Europe/Berlin
        region: WISH_REGIONS.EUROPE,
        startDate: "0 8 * * *",
        timezone: "Europe/Berlin",
    },
    {
        // 6 am in America/New_York
        region: WISH_REGIONS.AMERICA,
        startDate: "0 8 * * *",
        timezone: "America/New_York",
    },
    {
        // 6 am in Asia/Hong_Kong
        region: WISH_REGIONS.ASIA,
        startDate: "0 8 * * *",
        timezone: "Asia/Hong_Kong",
    },

    // diff ASIA - EU = 21600000
    // EU + 21600000 = NA
    // EU - 21600000 = ASIA
];

async function defineNotificationJobs() {
    // if (process.env.NODE_ENV !== "production") {
    //     console.log("Skipping notification setup in development mode");
    //     return;
    // }
    // just change this to cron jobs
    for (const config of notifyConfig) {
        console.log("Set up notifications job for: ", config.region);
        agenda.define(`notify${config.region}`, async (job, done) => {
            const jobAttributes = job.attrs.data as { region: WISH_REGIONS };

            console.log(`Notification job running for ${jobAttributes.region}`);
            await notifyUsers(jobAttributes.region);
            done();
        });

        const notifyJob = agenda.create(`notify${config.region}`, {
            region: config.region,
        });
        notifyJob.repeatEvery(config.startDate, {
            timezone: config.timezone,
        });
        await notifyJob.save();
    }

    // agenda.define("notifyOneTime", async (job, done) => {
    //     const jobAttributes = job.attrs.data as { region: WISH_REGIONS };

    //     const config = notifyConfig.find(
    //         (config) => config.region === jobAttributes.region
    //     );
    //     const notifyJob = agenda.create(`notify${jobAttributes.region}`, {
    //         region: jobAttributes.region,
    //     });
    //     notifyJob.repeatEvery("24 hours", {
    //         timezone: config.timezone,
    //     });
    //     await notifyJob.save();
    //     done();
    // });

    // for (const config of notifyConfig) {
    //     const notifyJob = await agenda.schedule(
    //         config.startDate,
    //         "notifyOneTime",
    //         { region: config.region }
    //     );

    //     await notifyJob.save();
    // }
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
                                wishInfo: lastIds,
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
