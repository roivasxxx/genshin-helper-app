import { Response } from "express";
import { CollectionConfig, PayloadRequest } from "payload/types";

const PublicUsers: CollectionConfig = {
    slug: "public-users",
    auth: {
        cookies: {
            secure: true,
            // samesite - domain specific - frontend on vercel?
            sameSite: "none",
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
                },
                {
                    name: "weapon",
                    type: "number",
                },
                {
                    name: "character",
                    type: "number",
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
                            type: { in: ["book", "weapon"] },
                        };
                    },
                },
                {
                    // enabled event notifications
                    // banner, events
                    // on start and end
                    type: "text",
                    name: "events",
                    hasMany: true,
                },
            ],
        },
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
    ],
    access: {
        create: () => true,
        read: () => true,
        update: () => false,
        delete: () => false,
        admin: () => false,
        unlock: () => false,
    },
};

export default PublicUsers;
