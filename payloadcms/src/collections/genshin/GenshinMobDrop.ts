import { CollectionConfig } from "payload/types";

const GenshinMobDrop: CollectionConfig = {
    slug: "genshin-mob-drops",
    fields: [
        {
            name: "name",
            type: "text",
        },
        {
            name: "icon",
            type: "upload",
            relationTo: "media",
            required: false,
        },
        {
            name: "mobIds",
            type: "array",
            fields: [
                {
                    name: "mobId",
                    type: "relationship",
                    relationTo: "genshin-mobs",
                    required: true,
                },
            ],
        },
    ],
};

export default GenshinMobDrop;
