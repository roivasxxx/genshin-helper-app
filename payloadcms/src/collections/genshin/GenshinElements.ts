import { CollectionConfig } from "payload/types";

const GenshinElements: CollectionConfig = {
    slug: "genshin-elements",
    fields: [
        {
            name: "id",
            type: "text",
        },
        {
            name: "name",
            type: "text",
        },
        {
            name: "icon",
            type: "upload",
            relationTo: "media",
            required: true,
        },
    ],
};

export default GenshinElements;
