import express from "express";
import payload from "payload";
import { mediaManagement } from "@roivasxxx/payload-cloudinary-plugin";
import { initAgenda } from "./agenda";
import { initializeMongo } from "./mongo";

require("dotenv").config();
const app = express();

// use cloudinary plugin
app.use(
    mediaManagement(
        {
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        },
        { unique_filename: false, use_filename: true }
    )
);
// Redirect root to Admin panel
app.get("/", (_, res) => {
    res.redirect("/admin");
});

app.get("/timeout", (req, res) => {
    res.send("OK");
});
const start = async () => {
    // Initialize Payload
    await payload.init({
        secret: process.env.PAYLOAD_SECRET,
        express: app,
        onInit: async () => {
            payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
        },
    });

    // auth middleware
    // https://payloadcms.com/docs/authentication/using-middleware#using-the-payload-auth-middleware
    // Add your own express routes here
    app.listen(process.env.PAYLOAD_PUBLIC_PORT);
    await initAgenda();
    await initializeMongo();
    // create cron jobs here
    // payload.find({ collection: "public-users" }).then((docs) => {
    //     console.log(`FOUND ${docs.docs.length} public users!`);
    // });
};

start();
