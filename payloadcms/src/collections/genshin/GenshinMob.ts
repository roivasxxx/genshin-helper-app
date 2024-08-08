import { CollectionConfig } from "payload/types";
import { accessControls } from "../../api/accessControls";

const GenshinMob: CollectionConfig = {
    slug: "genshin-mobs",
    fields: [
        {
            name: "id",
            type: "text",
        },
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
            // map location url
            name: "location",
            type: "text",
        },
        {
            // regular, boss, trounce mob
            name: "type",
            type: "select",
            options: [
                {
                    label: "Regular",
                    value: "regular",
                },
                {
                    label: "Boss",
                    value: "boss",
                },
                {
                    label: "Trounce",
                    value: "trouble",
                },
            ],
        },
    ],
    access: accessControls,
};

export default GenshinMob;
