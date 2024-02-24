import { CollectionConfig } from "payload/types";

const GenshinNPC: CollectionConfig = {
    slug: "genshin-npc",
    fields: [
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
        {
            // map location url
            name: "location",
            type: "text",
            required: true,
        },
    ],
};

export default GenshinNPC;
