import { CollectionConfig } from "payload/types";

const GenshinWishes: CollectionConfig = {
    slug: "genshin-wishes",
    fields: [
        {
            name: "bannerType",
            type: "select",
            options: [
                {
                    label: "Character",
                    value: "character",
                },
                {
                    label: "Weapon",
                    value: "weapon",
                },
                {
                    label: "Standard",
                    value: "standard",
                },
            ],
        },
        {
            name: "date",
            type: "text",
        },
        {
            // 1 for 3 stars, 2-10 for 4 stars, 2-90 for 5 stars
            name: "pity",
            type: "number",
        },
        {
            // returned from hoyo api
            name: "hoyoId",
            type: "text",
        },
        // {
        //     // this will be filled in based on the date -> find which banner was active during specified date
        //     // only for non-standard pulls
        //     name: "banner",
        //     type: "relationship",
        //     relationTo: "genshin-events",
        //     admin: {
        //         condition: (data) => {
        //             return data?.bannerType !== "standard";
        //         },
        //     },
        //     required: false,
        //     filterOptions: () => {
        //         return {
        //             type: { equals: "banner" },
        //         };
        //     },
        // },
        {
            name: "genshinAccount",
            type: "relationship",
            relationTo: "genshin-accounts",
        },
        {
            // id of character/weapon document
            // getWishHistory has to reduce information obtained from this relationship
            name: "itemId",
            type: "relationship",
            relationTo: ["genshin-characters", "genshin-weapons"],
        },
        {
            name: "wishNumber",
            type: "number",
        },
        // {
        //     // userId + bannerType + wishNumber - userId-standard-0, userId-weapon-1,...
        //     // use for querying, sorting
        //     name: "wishId",
        //     type: "text",
        //     admin: {
        //         condition: () => false,
        //     },
        // },
    ],
};

export default GenshinWishes;
