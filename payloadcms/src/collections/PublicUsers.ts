import { Response } from "express";
import { CollectionConfig, PayloadRequest } from "payload/types";
import authMiddleware from "../api/authMiddleware";
import payload from "payload";

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
            // support multiple accounts per user, these can be on different regions
            name: "genshinAccounts",
            type: "relationship",
            relationTo: "genshin-accounts",
            hasMany: true,
        },
        // do not show in requests
        { name: "expoPushToken", type: "text" },
        {
            name: "tracking",
            type: "group",
            fields: [
                {
                    name: "items",
                    type: "relationship",
                    relationTo: "genshin-items",
                    hasMany: true,
                },
                {
                    name: "events",
                    type: "checkbox",
                },
                {
                    name: "banners",
                    type: "checkbox",
                },
            ],
        },
    ],
    endpoints: [
        {
            path: "/register",
            method: "post",
            handler: async (req: PayloadRequest, res: Response) => {
                const { email, password } = req.body;
                try {
                    const existingUser = await req.payload.find({
                        collection: "public-users",
                        where: {
                            email: { equals: email },
                        },
                    });
                    if (existingUser.docs.length > 0) {
                        return res.status(400).send("User already exists");
                    }

                    await req.payload.create({
                        collection: "public-users",
                        data: { email, password },
                    });
                    const user = await req.payload.login({
                        collection: "public-users",
                        data: { email, password },
                    });
                    return res.send(user);
                } catch (error) {
                    return res.status(500).send(error);
                }
            },
        },
        {
            // setting expoPushToken for push notifications
            path: "/setExpoPushToken",
            method: "post",
            handler: [
                authMiddleware,
                async (req: PayloadRequest, res: Response) => {
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
                        console.error(
                            "public-users/setExpoPushToken threw an exception when saving token: ",
                            error
                        );
                    }
                    res.send("OK");
                },
            ],
        },
        {
            path: "/setNotificationSettings",
            method: "post",
            handler: [
                authMiddleware,
                async (req: PayloadRequest, res: Response) => {
                    const body = req.body;
                    if (typeof body !== "object") {
                        return res.status(400).send("Invalid body");
                    }
                    const notifications = {
                        events: false,
                        banners: false,
                        items: [],
                    };

                    if (typeof body.events === "boolean") {
                        notifications.events = body.events;
                    }
                    if (typeof body.banners === "boolean") {
                        notifications.banners = body.banners;
                    }
                    if (body.items && Array.isArray(body.items)) {
                        // check valid domains
                        for (const item of body.items) {
                            if (typeof item === "string") {
                                try {
                                    await payload.findByID({
                                        collection: "genshin-items",
                                        id: item,
                                    });
                                    notifications.items.push(item);
                                } catch (error) {
                                    console.error(
                                        `genshin-accounts/setNotificationSettings: invalid item provided ${item}`
                                    );
                                }
                            }
                        }
                    }

                    try {
                        await req.payload.update({
                            collection: "public-users",
                            where: {
                                id: {
                                    equals: req.user.id,
                                },
                            },
                            data: { tracking: notifications },
                        });
                    } catch (error) {
                        console.error(
                            "genshin-accounts/setNotificationSettings threw an exception when saving notification settings: ",
                            error
                        );
                        return res.status(500).send(error);
                    }
                    res.send("OK");
                },
            ],
        },
        {
            path: "/forgot-password",
            method: "post",
            handler: async (req: PayloadRequest, res: Response) => {
                const { email } = req.body;
                const user = await req.payload.find({
                    collection: "public-users",
                    where: {
                        email: { equals: email },
                    },
                });
                if (user.docs.length === 0) {
                    return res.status(404).send("User not found");
                }
                // https://payloadcms.com/docs/authentication/operations#forgot-password
                // const token = await req.payload.forgotPassword({
                //     collection: "public-users",
                //     data: {
                //         email,
                //     },
                //     disableEmail: true,
                // });
                res.send("OK");
            },
        },
    ],
    access: {
        create: () => true,
        read: () => true,
        update: ({ req }) => {
            return true;
        },
        delete: () => false,
        admin: () => false,
        unlock: () => false,
    },
};

export default PublicUsers;
