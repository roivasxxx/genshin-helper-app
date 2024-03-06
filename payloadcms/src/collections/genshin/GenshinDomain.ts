import { CollectionConfig } from "payload/types";
import { genshinSelectField } from "../../fields/fieldsConfig";

const GenshinDomain: CollectionConfig = {
    slug: "genshin-domains",
    fields: [
        {
            name: "name",
            type: "text",
        },
        {
            // url to map
            name: "location",
            type: "text",
        },
        {
            name: "type",
            type: "select",
            options: [
                {
                    label: "Artifact",
                    value: "artifact",
                },
                {
                    label: "Book",
                    value: "book",
                },
                {
                    label: "Weapon",
                    value: "weapon",
                },
                {
                    label: "Trounce",
                    value: "Trounce",
                },
            ],
        },
        genshinSelectField({
            collection: "genshin-mobs",
            fieldName: "enemies",
            hasMany: true,
        }),
    ],
};

export default GenshinDomain;
