import { CollectionConfig } from "payload/types";
import { WISH_REGIONS } from "../../constants";

const GenshinAccounts: CollectionConfig = {
    slug: "genshin-accounts",
    fields: [
        {
            // region
            name: "region",
            type: "select",
            options: Object.keys(WISH_REGIONS).map((key) => ({
                label: WISH_REGIONS[key],
                value: key,
            })),
        },
        {
            // hoyo uuid
            name: "hoyoId",
            type: "text",
        },
        {
            // wish history
            name: "wishInfo",
            type: "group",
            fields: [
                {
                    name: "standard",
                    type: "number",
                    defaultValue: 0,
                },
                {
                    name: "weapon",
                    type: "number",
                    defaultValue: 0,
                },
                {
                    name: "character",
                    type: "number",
                    defaultValue: 0,
                },
            ],
        },
    ],
};

export default GenshinAccounts;
