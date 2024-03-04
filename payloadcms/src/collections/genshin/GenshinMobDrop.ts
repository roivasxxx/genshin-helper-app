import { CollectionConfig } from "payload/types";
import { genshinSelectField } from "../../fields/fieldsConfig";

const GenshinMobDrop: CollectionConfig = {
    slug: "genshin-mob-drops",
    fields: [
        {
            name: "items",
            type: "array",
            fields: [
                {
                    name: "name",
                    type: "text",
                },
                {
                    name: "icon",
                    type: "upload",
                    relationTo: "media",
                },
            ],
        },
        genshinSelectField({
            fieldName: "mobIds",
            collection: "genshin-mobs",
            hasMany: true,
        }),
    ],
};

export default GenshinMobDrop;
