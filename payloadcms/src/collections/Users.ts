import { CollectionConfig } from "payload/types";
import { accessControls } from "../api/accessControls";

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
        {
            name: "roles",
            type: "select",
            options: [
                {
                    label: "Admin",
                    value: "admin",
                },
            ],
        },
    ],
    access: accessControls,
};

export default Users;
