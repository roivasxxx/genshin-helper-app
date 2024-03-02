import { CollectionConfig } from "payload/types";

const GenshinItems: CollectionConfig = {
    slug: "genshin-items",
    fields: [
        {
            name: "name",
            type: "text",
        },
        {
            name: "type",
            type: "select",
            options: [
                {
                    label: "Collectable", // plants,..., open world
                    value: "collectable",
                },
                {
                    label: "Food",
                    value: "food",
                },
                {
                    label: "Mob Drop",
                    value: "mobDrop",
                },
                {
                    label: "Character Ascension", // dropped by bosses - fragment, chunk, gem, separate because of travele
                    value: "characterAscension",
                },
                {
                    label: "Book",
                    value: "book",
                },
                {
                    label: "Weapon Ascension",
                    value: "weaponAscension",
                },
                {
                    label: "Weapon Ascension Material", // event/fishing/quest items
                    value: "weaponAscensionMaterial",
                },
                {
                    label: "Character XP Book",
                    value: "expBook",
                },
                {
                    label: "Weapon XP Ore",
                    value: "expOre",
                },
            ],
        },
    ],
};

export default GenshinItems;
