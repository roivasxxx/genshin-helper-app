import { CollectionConfig } from "payload/types";

const GenshinWishes: CollectionConfig = {
    slug: "genshin-wishes",
    fields: [
        {
            name: "userId",
            type: "relationship",
            relationTo: "public-users",
        },
        {
            // id of character/weapon document
            // getWishHistory has to reduce information obtained from this relationship
            name: "itemId",
            type: "relationship",
            relationTo: ["genshin-characters", "genshin-weapons"],
        },
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
            type: "date",
        },
        {
            // this will be filled in based on the date -> find which banner was active during specified date
            // only for non-standard pulls
            name: "banner",
            type: "relationship",
            relationTo: "genshin-events",
            admin: {
                condition: (data) => {
                    return data?.bannerType !== "standard";
                },
            },
            filterOptions: (data) => {
                return {
                    type: { equals: "banner" },
                };
            },
        },
        {
            // userId + bannerType + wishNumber - userId-standard-0, userId-weapon-1,...
            // use for querying, sorting
            name: "wishId",
            type: "text",
            admin: {
                condition: () => false,
            },
        },
    ],
};

export default GenshinWishes;
