import { CollectionConfig, GroupField } from "payload/types";
import { genshinSelectField } from "../../fields/fieldsConfig";
import { DAYS } from "../../constants";
import { accessControls } from "../../api/accessControls";

const details = (): GroupField[] => {
    return Object.values(DAYS).map((day) => {
        return {
            name: day.toString(),
            type: "group",
            fields: [
                {
                    name: "drops",
                    type: "relationship",
                    relationTo: "genshin-items",
                    hasMany: true,
                },
                {
                    name: "characters",
                    type: "relationship",
                    relationTo: "genshin-characters",
                    hasMany: true,
                },
            ],
        };
    });
};

const GenshinDomain: CollectionConfig = {
    slug: "genshin-domains",
    access: accessControls,
    fields: [
        { name: "id", type: "text" },
        { name: "region", type: "text" },
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
                    value: "artifacts",
                },
                {
                    label: "Book",
                    value: "books",
                },
                {
                    label: "Weapon",
                    value: "weapons",
                },
                {
                    label: "Trounce",
                    value: "trounce",
                },
            ],
        },
        {
            name: "details",
            type: "group",
            fields: details(),
        }, // we can query details.sunday.drops to get all possible drops
        // genshinSelectField({
        //     collection: "genshin-mobs",
        //     fieldName: "enemies",
        //     hasMany: true,
        // }),
    ],
};

export default GenshinDomain;
