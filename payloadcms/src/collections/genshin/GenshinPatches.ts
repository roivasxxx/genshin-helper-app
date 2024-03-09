import { CollectionConfig } from "payload/types";

const GenshinPatches: CollectionConfig = {
    slug: "genshin-patches",
    fields: [
        {
            name: "patchNumber",
            type: "text",
        },
        {
            name: "releaseDate",
            type: "date",
        },
        {
            name: "changes",
            type: "richText",
        },
    ],
};

export default GenshinPatches;
