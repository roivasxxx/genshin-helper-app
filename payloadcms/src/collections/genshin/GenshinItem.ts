import { CollectionConfig } from "payload/types";

const GenshinItems: CollectionConfig = {
    slug: "genshin-items",
    fields: [
        {
            name: "id",
            type: "text",
        },
        {
            name: "type",
            type: "select",
            // use genshinItemConfig whenever selecting from GenshinItems based on a type (so always)
            // artifacts and weapons have their own collections, because otherwise this one would become very unreadable
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
                    label: "Character Ascension", // dropped by bosses - fragment, chunk, gem, separate because of traveler
                    value: "characterAscension",
                },
                {
                    // the collectible books
                    label: "Book",
                    value: "book",
                },
                {
                    label: "Weapon Ascension",
                    value: "weaponMat",
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
                {
                    label: "Fish",
                    value: "fish",
                },
                {
                    label: "Mob drop",
                    value: "mobDrop",
                },
                {
                    label: "Boss drop",
                    value: "bossDrop",
                },
                {
                    label: "Trounce drop",
                    value: "trounceDrop",
                },
            ],
        },
        { name: "icon", type: "upload", relationTo: "media" },
        // {
        //     // some item types exist in multiple variations -> use an array
        //     // for example: books in weapon ascension, character ascension, etc
        //     // those that only exist in one variation -> one item
        //     name: "items",
        //     type: "array",
        //     fields: [
        //         {
        //             name: "name",
        //             type: "text",
        //         },
        //         { name: "icon", type: "upload", relationTo: "media" },
        //     ],
        // },
    ],
};

export default GenshinItems;
