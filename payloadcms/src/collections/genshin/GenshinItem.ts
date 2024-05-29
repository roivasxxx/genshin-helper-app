import { Response } from "express";
import { CollectionConfig, PayloadRequest } from "payload/types";
import authMiddleware from "../../api/authMiddleware";
import { relationToDictionary } from "../../utils";
import { RecordWithIcon, SimpleRecord } from "../../../types/types";
import { GenshinItem } from "../../../types/payload-types";

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
            required: true,
        },
        {
            name: "rarity",
            type: "number",
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
                {
                    label: "Gem",
                    value: "gem",
                },
                {
                    label: "Specialty", // collectable items - cecilia, scarab, windwheel aster, etc...
                    value: "specialty",
                },
            ],
        },
        { name: "icon", type: "upload", relationTo: "media", required: true },
        { name: "region", type: "text" },
        {
            name: "days",
            type: "select",
            options: [
                {
                    value: "0",
                    label: "Sunday",
                },
                {
                    value: "1",
                    label: "Monday",
                },
                {
                    value: "2",
                    label: "Tuesday",
                },
                {
                    value: "3",
                    label: "Wednesday",
                },
                {
                    value: "4",
                    label: "Thursday",
                },
                {
                    value: "5",
                    label: "Friday",
                },
                {
                    value: "6",
                    label: "Saturday",
                },
            ],
            hasMany: true,
        },
        {
            name: "sibling",
            type: "relationship", // trounce domain drops,
            relationTo: "genshin-items",
            hasMany: true,
        },
        {
            name: "domain",
            type: "relationship",
            relationTo: "genshin-domains",
        },
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
        {
            method: "get",
            path: "/getItems",
            handler: async (req: PayloadRequest, res: Response) => {
                const itemsReq = await req.payload.find({
                    collection: "genshin-items",
                    where: {
                        or: [
                            {
                                and: [
                                    {
                                        sibling: {
                                            exists: true, // trounceDrop, mobDrop, books, weaponMat
                                        },
                                    },
                                ],
                            },
                            {
                                and: [
                                    {
                                        sibling: {
                                            exists: false,
                                        },
                                    },
                                    {
                                        type: {
                                            in: [
                                                "specialty",
                                                "bossDrop",
                                                "gem",
                                            ],
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    sort: "name",
                    pagination: false,
                });

                const items = itemsReq.docs.map((item) => {
                    const { sibling, domain, days, ...rest } = item;

                    let mappedItem: {
                        type: typeof item.type;
                        value: (RecordWithIcon & {
                            rarity: typeof item.rarity;
                        })[];
                        days?: typeof item.days;
                        domain?: SimpleRecord;
                    } = {
                        type: rest.type,
                        value: [],
                    };
                    const itemValue = relationToDictionary(rest);
                    if (typeof itemValue !== "string") {
                        mappedItem.value.push({
                            ...itemValue,
                            rarity: rest.rarity,
                        });
                    }
                    if (days && days.length > 0) {
                        mappedItem.days = days;
                    }
                    if (domain && typeof domain === "object") {
                        mappedItem.domain = {
                            id: domain.id,
                            name: domain.name,
                        };
                    }
                    if (
                        sibling &&
                        typeof sibling === "object" &&
                        Array.isArray(sibling)
                    ) {
                        sibling.forEach((el) => {
                            if (typeof el !== "string") {
                                const siblingValue = relationToDictionary(el);
                                if (typeof siblingValue !== "string") {
                                    mappedItem.value.push({
                                        ...siblingValue,
                                        rarity: el.rarity,
                                    });
                                }
                            }
                        });
                    }
                    return mappedItem;
                });

                return res.send(items);
            },
        },
    ],
};

export default GenshinItems;
