import { Response } from "express";
import { CollectionConfig, PayloadRequest } from "payload/types";
import authMiddleware from "../../api/authMiddleware";

const GenshinItems: CollectionConfig = {
    slug: "genshin-items",
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
            name: "rarity",
            type: "number",
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
    endpoints: [
        {
            method: "get",
            path: "/domainItems",
            handler: [
                authMiddleware,
                async (req: PayloadRequest, res: Response) => {
                    try {
                        const docs = await req.payload.find({
                            collection: "genshin-items",
                            where: {
                                and: [
                                    {
                                        rarity: {
                                            equals: 2,
                                        },
                                    },
                                    { type: { in: ["book", "weaponMat"] } },
                                ],
                            },
                            pagination: false,
                            sort: "name",
                        });
                        if (docs.docs) {
                            const mappedItems = docs.docs.map((el) => {
                                if (
                                    typeof el.icon === "object" &&
                                    "days" in el
                                ) {
                                    return {
                                        id: el.id,
                                        name: el.name,
                                        icon: el.icon.cloudinary.secure_url,
                                        type: el.type,
                                        days: el.days,
                                    };
                                }
                            });
                            return res.send(mappedItems);
                        }

                        return res.send([]);
                    } catch (error) {
                        return res.status(500).send(error);
                    }
                },
            ],
        },
    ],
};

export default GenshinItems;
