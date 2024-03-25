import { Response } from "express";
import { CollectionConfig, PayloadRequest } from "payload/types";
import { ALLOWED_EVENT_NOTIFICATIONS } from "../constants";
import authMiddleware from "../api/authMiddleware";

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
        { name: "expoPushToken", type: "text", hidden: true },
    ],
    endpoints: [
        {
            path: "/register",
            method: "post",
            handler: (req: PayloadRequest, res: Response) => {
                const { email, password } = req.body;

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
