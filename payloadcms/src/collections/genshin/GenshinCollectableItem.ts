import { CollectionConfig } from "payload/types";

const GenshinCollectableItem: CollectionConfig = {
    slug: "genshin-collectable-item",
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
        {
            name: "npcs",
            type: "array",
            required: false,
            fields: [
                {
                    name: "npcId",
                    type: "relationship",
                    relationTo: "genshin-npc",
                    required: true,
                },
            ],
        },
    ],
};

export default GenshinCollectableItem;
