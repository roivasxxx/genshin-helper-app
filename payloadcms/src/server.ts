import express from "express";
import payload from "payload";
import { mediaManagement } from "@roivasxxx/payload-cloudinary-plugin";
import { initAgenda } from "./agenda";
import { initializeMongo } from "./mongo";
import nodemailer from "nodemailer";

require("dotenv").config();
const app = express();

const transport = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILJET_API_KEY,
        pass: process.env.MAILJET_SECRET,
    },
});

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
        email: {
            fromName: "Electro Mains",
            fromAddress: process.env.SERVICE_EMAIL,
            transport,
        },
    });

    // auth middleware
    // https://payloadcms.com/docs/authentication/using-middleware#using-the-payload-auth-middleware
    // Add your own express routes here
    app.listen(process.env.PAYLOAD_PUBLIC_PORT);
    await initAgenda();
    await initializeMongo();
};

start();
