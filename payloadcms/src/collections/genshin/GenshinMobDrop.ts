import { CollectionConfig } from "payload/types";
import { genshinSelectField } from "../../fields/fieldsConfig";
import payload from "payload";

const GenshinMobDrop: CollectionConfig = {
    slug: "genshin-mob-drops",
    fields: [
        {
            name: "name",
            type: "text",
        },
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
        {
            name: "mobType",
            type: "text",
            hidden: true,
        },
        genshinSelectField({
            fieldName: "mobIds",
            collection: "genshin-mobs",
            hasMany: true,
        }),
    ],
    hooks: {
        beforeChange: [
            async ({ data }) => {
                if (data?.mobIds && Array.isArray(data?.mobIds)) {
                    const mob = await payload.findByID({
                        // set mobType based on found mob
                        collection: "genshin-mobs",
                        id: data.mobIds[0],
                    });
                    data.mobType = mob.type;
                }
                return data;
            },
        ],
    },
};

export default GenshinMobDrop;
