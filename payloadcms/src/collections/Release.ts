import { CollectionConfig } from "payload/types";

const Releases: CollectionConfig = {
    slug: "releases",
    fields: [
        {
            name: "allowImport",
            type: "checkbox",
        },
        {
            name: "version",
            type: "text",
        },
        {
            name: "content",
            type: "array",
            fields: [
                {
                    name: "title",
                    type: "text",
                },
                {
                    name: "content",
                    type: "textarea",
                },
            ],
        },
    ],
};
export default Releases;
