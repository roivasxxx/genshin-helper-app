import { CollectionConfig } from "payload/types";

const GenshinMob: CollectionConfig = {
    slug: "genshin-mob-drop",
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
                    relationTo: "genshin-mob",
                    required: true,
                },
            ],
        },
    ],
};

export default GenshinMob;
