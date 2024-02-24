import { CollectionConfig } from "payload/types";

const GenshinDomain: CollectionConfig = {
    slug: "genshin-domain",
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
                    value: "trouble",
                },
            ],
        },
        {
            name: "enemies",
            type: "array",
            minRows: 1,
            fields: [
                {
                    name: "enemyId",
                    type: "relationship",
                    relationTo: "genshin-mob",
                },
            ],
            validate: (value, options) => {
                if (options?.parent?.type === "trounce" && value.length > 1) {
                    // max rows for trounce domains should be 1 - needs to be done via ui
                    return "Too many enemies for trounce domain!";
                }
                return true;
            },
        },
    ],
};

export default GenshinDomain;
