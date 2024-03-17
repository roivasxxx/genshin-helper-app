import Agenda from "agenda";
import payload from "payload";
// import dotenv from "dotenv";
require("dotenv").config();
// dotenv.config();

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
                    console.log("wishImporter agenda: ", job.attrs.data);
                    // if (job.attrs.data.cmsJob) {
                    //     await payload.update({
                    //         collection: "jobs",
                    //         id: job.attrs.data.cmsJob,
                    //         data: {
                    //             status: "IN_PROGRESS",
                    //         },
                    //     });
                    // }
                    // await wishImporter(query.link);
                }
            );

            await agenda.start();
        } catch (error) {
            console.error("Error in initAgenda: ", error);
        }
    });
};

export { agenda, initAgenda };
