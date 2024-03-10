import { Response } from "express";
import payload from "payload";
import { CollectionConfig, PayloadRequest } from "payload/types";
import { ALLOWED_EVENT_NOTIFICATIONS } from "../constants";

const PublicUsers: CollectionConfig = {
    slug: "public-users",
    auth: {
        cookies: {
            secure: true,
            sameSite:
                process.env.PAYLOAD_ENV === "development" ? "none" : "strict",
        },

        // 30 days
        tokenExpiration: 60 * 60 * 24 * 30,
    },
    admin: {
        useAsTitle: "email",
    },
    fields: [
        // Email added by default
        // Add more fields as needed
        {
            // wish history, used for creating unique ids for genshin wishes
            name: "wishInfo",
            type: "group",
            fields: [
                {
                    name: "standard",
                    type: "number",
                    defaultValue: 0,
                },
                {
                    name: "weapon",
                    type: "number",
                    defaultValue: 0,
                },
                {
                    name: "character",
                    type: "number",
                    defaultValue: 0,
                },
            ],
        },
        {
            name: "genshinTracking",
            type: "group",
            fields: [
                {
                    // domain tracking, used for notifications, only use book/weapon
                    type: "relationship",
                    name: "domains",
                    relationTo: "genshin-domains",
                    hasMany: true,
                    filterOptions: () => {
                        return {
                            type: {
                                in: ["book", "weapon"],
                            },
                        };
                    },
                },
                {
                    // enabled event notifications
                    // banner or events
                    // on start and end
                    type: "text",
                    name: "events",
                    hasMany: true,
                },
            ],
        },
        // do not show in requests
        { name: "expoPushToken", type: "text", hidden: true },
    ],
    endpoints: [
        {
            path: "/register",
            method: "post",
            handler: (req: PayloadRequest, res: Response) => {
                const { email, password } = req.body;
                console.log("email", email, "password", password);
                req.payload.create({
                    collection: "public-users",
                    data: { email, password },
                });
                res.send("OK");
            },
        },
        {
            // setting expoPushToken for push notifications
            path: "/setExpoPushToken",
            method: "post",
            handler: async (req: PayloadRequest, res: Response) => {
                if (!req.user) {
                    res.status(401).send("Unauthorized");
                }
                if (
                    typeof req?.body !== "object" ||
                    !req?.body?.expoPushToken
                ) {
                    return res.status(400).send("Invalid body");
                }
                try {
                    await req.payload.update({
                        collection: "public-users",
                        where: {
                            id: { equals: req.user.id },
                        },
                        data: {
                            expoPushToken: req.body.expoPushToken,
                        },
                    });
                } catch (error) {
                    console.log(
                        "public-users/setExpoPushToken threw an exception when saving token: ",
                        error
                    );
                }
                res.send("OK");
            },
        },
        {
            path: "/setNotificationSettings",
            method: "post",
            handler: async (req: PayloadRequest, res: Response) => {
                if (!req.user) {
                    res.status(401).send("Unauthorized");
                }

                const body = req.body;
                if (typeof body !== "object") {
                    return res.status(400).send("Invalid body");
                }

                const notifications = {};
                const events = [];
                const domains = [];
                if (body.events && Array.isArray(body.events)) {
                    // filter allowed notifications
                    for (const notif of body.events) {
                        if (
                            typeof notif === "string" &&
                            ALLOWED_EVENT_NOTIFICATIONS[notif.toUpperCase()]
                        ) {
                            events.push(notif);
                        }
                    }
                }
                if (body.domains && Array.isArray(body.domains)) {
                    try {
                        const domainsReq = await payload.find({
                            collection: "genshin-domains",
                        });
                        const allDomains = domainsReq.docs;
                        // check valid domains
                        for (const domain of body.domains) {
                            if (
                                typeof domain === "string" &&
                                allDomains.some((d) => d.id === domain)
                            ) {
                                domains.push(domain);
                            }
                        }
                    } catch (error) {
                        console.error(
                            "public-users/setNotificationSettings threw an exception when trying to find domains: ",
                            error
                        );
                    }
                }

                if (events.length > 0) {
                    notifications["events"] = events;
                }
                if (domains.length > 0) {
                    notifications["domains"] = domains;
                }

                try {
                    await payload.update({
                        collection: "public-users",
                        where: {
                            id: {
                                equals: req.user.id,
                            },
                        },
                        data: { genshinTracking: { events: events } },
                    });
                } catch (error) {
                    console.error(
                        "public-users/setNotificationSettings threw an exception when saving notification settings: ",
                        error
                    );
                    res.status(500).send(error);
                }
                res.send("OK");
            },
        },
    ],
    access: {
        create: () => true,
        read: () => true,
        update: ({ req }) => {
            console.log(req.user);
            return true;
        },
        delete: () => false,
        admin: () => false,
        unlock: () => false,
    },
};

export default PublicUsers;
