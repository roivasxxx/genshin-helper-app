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
                label: key.toLowerCase(),
                value: WISH_REGIONS[key],
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
                {
                    name: "lastUpdate",
                    type: "date",
                },
            ],
        },
    ],
};

export default GenshinAccounts;
