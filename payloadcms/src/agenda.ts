import Agenda from "agenda";
import payload from "payload";
// import dotenv from "dotenv";
require("dotenv").config();

// const mongoConnectionString = process.env.AGENDA_URI;
// console.log("connection string:", mongoConnectionString);
// export const agenda = new Agenda({
//     db: {
//         address: mongoConnectionString,
//     },
// });

// export const initAgenda = async () => {
//     agenda.on("ready", async () => {
//         try {
//             agenda.define(
//                 "wishImporter",
//                 { shouldSaveResult: false, concurrency: 10 },
//                 async (job) => {
//                     console.log("wishImporter agenda: ", job.attrs.data);
//                     if (job.attrs.data.cmsJob) {
//                         await payload.update({
//                             collection: "jobs",
//                             id: job.attrs.data.cmsJob,
//                             data: {
//                                 status: "IN_PROGRESS",
//                             },
//                         });
//                     }
//                     // await wishImporter(query.link);
//                 }
//             );

//             await agenda.start();
//         } catch (error) {
//             console.error("Error in initAgenda: ", error);
//         }
//     });
// };
