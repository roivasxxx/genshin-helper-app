import express from "express";
import payload from "payload";

require("dotenv").config();
const app = express();

// Redirect root to Admin panel
app.get("/", (_, res) => {
    res.redirect("/admin");
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
};

start();
