import { CollectionConfig } from "payload/types";

const Users: CollectionConfig = {
    slug: "users",
    auth: {
        cookies: {
            secure: process.env.PAYLOAD_ENV !== "development",
            // samesite - domain specific - frontend on vercel?
            sameSite:
                process.env.PAYLOAD_ENV !== "development" ? "none" : "lax",
        },
    },
    admin: {
        useAsTitle: "email",
    },
    fields: [
        // Email added by default
        // Add more fields as needed
    ],
    endpoints: [],
};

export default Users;
