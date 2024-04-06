import Agenda, { Processor } from "agenda";
import payload from "payload";
import { GenshinAccount, Job } from "../types/payload-types";
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
        startDate: 1712469600000,
        timezone: "Europe/Berlin",
    },
    {
        // 6 am in America/New_York
        region: WISH_REGIONS.AMERICA,
        startDate: 1712491200000,
        timezone: "America/New_York",
    },
    {
        // 6 am in Asia/Hong_Kong
        region: WISH_REGIONS.ASIA,
        startDate: 1712448000000,
        timezone: "Asia/Hong_Kong",
    },
];

function defineNotificationJobs() {
    for (const config of notifyConfig) {
        agenda.define(`notify${config.region}`, async (job, done) => {
            console.log(`Notification job running for ${config.region}`);
            await notifyUsers(config.region);
            done();
        });

        const notifyJob = agenda.create(`notify${config.region}`, {});
        notifyJob.repeatEvery("24 hours", {
            timezone: config.timezone,
            startDate: config.startDate,
        });
    }
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
            agenda.define(
                "wishImporter",
                { shouldSaveResult: false, concurrency: 10 },
                async (job: any, done) => {
                    const jobAttributes: {
                        cmsJob: Job;
                        account: GenshinAccount;
                    } = job.attrs.data;

                    if (jobAttributes.cmsJob) {
                        try {
                            await payload.update({
                                collection: "jobs",
                                id: jobAttributes.cmsJob.id,
                                data: {
                                    status: "IN_PROGRESS",
                                },
                            });
                        } catch (error) {
                            if (
                                typeof error === "object" &&
                                error?.status === 404
                            ) {
                                console.error(
                                    "Job not found: ",
                                    jobAttributes.cmsJob.id
                                );
                                // found invalid job
                                throw new Error("Job not found!");
                            }
                        }
                    } else {
                        console.error("No job provided!");
                        throw new Error("No job provided!");
                    }
                    const link = jobAttributes.cmsJob.link;

                    const account = jobAttributes.account;
                    let lastIds = account.wishInfo;
                    // process history
                    const result = await wishImporter(
                        link,
                        account.id,
                        lastIds
                    );
                    // check if there was an error
                    const hasError = !result;

                    try {
                        if (jobAttributes.cmsJob) {
                            if (hasError) {
                                // if there was an error, mark job as failed
                                await payload.update({
                                    collection: "jobs",
                                    id: jobAttributes.cmsJob.id,
                                    data: {
                                        status: "FAILED",
                                    },
                                });
                            } else {
                                // if there was no error
                                // if job still exists, delete it
                                await payload.delete({
                                    collection: "jobs",
                                    id: jobAttributes.cmsJob.id,
                                });
                                // update account
                                await payload.update({
                                    id: jobAttributes.account.id,
                                    collection: "genshin-accounts",
                                    data: {
                                        importJob: "",
                                        wishInfo: lastIds,
                                    },
                                });
                                console.time("test");
                                const db = mongoClient.db("electro");
                                const collection =
                                    db.collection("genshin-wishes");
                                for (const key of Object.keys(result)) {
                                    // need to insert with mongo, because payload doesn't support bulk insert
                                    const wishes = result[key].wishes;
                                    if (
                                        Array.isArray(wishes) &&
                                        wishes.length > 0
                                    ) {
                                        // wishes for a banner might be empty, insertMany expects non-empty array
                                        await collection.insertMany(
                                            result[key].wishes
                                        );
                                    }
                                }
                                console.timeEnd("test");
                            }
                        }
                    } catch (error) {
                        console.error(
                            "Error while executing job: ",
                            jobAttributes.cmsJob.id,
                            error
                        );
                        try {
                            // remove job from account
                            await payload.update({
                                id: jobAttributes.account.id,
                                collection: "genshin-accounts",
                                data: {
                                    importJob: "",
                                },
                            });
                            // delete job
                            await payload.delete({
                                collection: "jobs",
                                id: jobAttributes.cmsJob.id,
                            });
                        } catch (e) {}
                    }
                    console.log("Done with job: ", jobAttributes.cmsJob.id);
                    done();
                }
            );

            const notifyEUROPE = agenda.create("notify", {});
            notifyEUROPE.repeatEvery("24 hours", {
                timezone: "Europe/Berlin",
                startDate: 1712469600000,
            });

            defineNotificationJobs();

            await agenda.start();
        } catch (error) {
            console.error("Error in initAgenda: ", error);
        }
    });
};

export { agenda, initAgenda };
