import { CollectionConfig } from "payload/types";

const Jobs: CollectionConfig = {
    slug: "jobs",
    fields: [
        {
            name: "status",
            type: "select",
            options: [
                {
                    label: "new",
                    value: "NEW",
                },
                {
                    label: "in progress",
                    value: "IN_PROGRESS",
                },
                {
                    label: "completed",
                    value: "COMPLETED",
                },
                {
                    label: "failed",
                    value: "FAILED",
                },
            ],
        },
        {
            name: "link",
            type: "text",
        },
    ],
};

export default Jobs;
