import { CollectionConfig } from "payload/types";

const Jobs: CollectionConfig = {
    slug: "jobs",
    fields: [
        {
            name: "status",
            type: "select",
            options: [
                {
                    label: "New",
                    value: "NEW",
                },
                {
                    label: "In progress",
                    value: "IN_PROGRESS",
                },
                {
                    label: "Completed",
                    value: "COMPLETED",
                },
                {
                    label: "Failed",
                    value: "FAILED",
                },
                {
                    label: "Cancelled",
                    value: "CANCELLED",
                },
            ],
            required: true,
        },
        {
            name: "genshinAccount",
            relationTo: "genshin-accounts",
            type: "relationship",
            required: true,
        },
    ],
};

export default Jobs;
