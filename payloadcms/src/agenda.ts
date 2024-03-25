import Agenda from "agenda";
import payload from "payload";
import { GenshinAccount, Job } from "../types/payload-types";
import { wishImporter } from "./api/wishes/importer";
import { DEFAULT_GENSHIN_WISH_INFO } from "./constants";
import { GenshinAcountWishInfo } from "../types/types";
require("dotenv").config();

let agenda: Agenda;

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
                async (job) => {
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
                                    jobAttributes.cmsJob
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
                    let lastIds = JSON.parse(
                        JSON.stringify(DEFAULT_GENSHIN_WISH_INFO)
                    ) as GenshinAcountWishInfo;
                    const wishInfo = account?.wishInfo;
                    if (wishInfo) {
                        if (wishInfo.character.lastId) {
                            lastIds.character.lastId =
                                wishInfo.character.lastId;
                        }
                        if (wishInfo.weapon.lastId) {
                            lastIds.weapon.lastId = wishInfo.weapon.lastId;
                        }
                        if (wishInfo.standard.lastId) {
                            lastIds.standard.lastId = wishInfo.standard.lastId;
                        }
                    }
                    // await wishImporter(jobAttributes.link, lastIds);

                    const newWishInfo = account.wishInfo;

                    try {
                        if (jobAttributes.cmsJob) {
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
                                    wishInfo: newWishInfo,
                                },
                            });
                        }
                    } catch (error) {
                        if (
                            typeof error === "object" &&
                            error?.status === 404
                        ) {
                            // found invalid job
                            return;
                        }
                    }
                }
            );

            await agenda.start();
        } catch (error) {
            console.error("Error in initAgenda: ", error);
        }
    });
};

export { agenda, initAgenda };
