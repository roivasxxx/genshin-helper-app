import { Response } from "express";
import { CollectionConfig, PayloadRequest } from "payload/types";

const PublicUsers: CollectionConfig = {
    slug: "public-users",
    auth: {
        cookies: {
            secure: process.env.PAYLOAD_ENV !== "development",
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
