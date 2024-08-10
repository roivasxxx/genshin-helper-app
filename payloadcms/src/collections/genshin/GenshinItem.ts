import { Response } from "express";
import { CollectionConfig, PayloadRequest } from "payload/types";
import { relationToDictionary } from "../../utils";
import { RecordWithIcon, SimpleRecord } from "../../../types/types";
import { GenshinItem } from "../../../types/payload-types";
import { accessControls } from "../../api/accessControls";

const mapGenshinItem = (item: GenshinItem) => {
    const { sibling, domain, days, ...rest } = item;

    let mappedItem: {
        id: string;
        type: typeof item.type;
        value: (RecordWithIcon & {
            rarity: typeof item.rarity;
        })[];
        days?: typeof item.days;
        domain?: SimpleRecord;
    } = {
        id: item.id,
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
    if (sibling && typeof sibling === "object" && Array.isArray(sibling)) {
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
};

const GenshinItems: CollectionConfig = {
    slug: "genshin-items",
    access: accessControls,
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
            path: "/getItems",
            handler: async (req: PayloadRequest, res: Response) => {
                try {
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

                    const items = itemsReq.docs.map(mapGenshinItem);

                    return res.send(items);
                } catch (error) {
                    console.error("getItems threw an error: ", error);
                    return res.status(500).send(error);
                }
            },
        },
        {
            path: "/getDomainItems",
            method: "get",
            handler: async (req: PayloadRequest, res: Response) => {
                try {
                    const itemsReq = await req.payload.find({
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
                        sort: "name",
                        pagination: false,
                    });

                    const mappedItems = itemsReq.docs.map(mapGenshinItem);
                    const itemsMap = {
                        // once natlan comes out - update this
                        books: [
                            mappedItems.filter(
                                (el) =>
                                    el.type === "book" &&
                                    el.domain &&
                                    el.domain.id === "forsaken_rift"
                            ),
                            mappedItems.filter(
                                (el) =>
                                    el.type === "book" &&
                                    el.domain &&
                                    el.domain.id === "taishan_mansion"
                            ),
                            mappedItems.filter(
                                (el) =>
                                    el.type === "book" &&
                                    el.domain &&
                                    el.domain.id === "violet_court"
                            ),
                            mappedItems.filter(
                                (el) =>
                                    el.type === "book" &&
                                    el.domain &&
                                    el.domain.id === "steeple_of_ignorance"
                            ),
                            mappedItems.filter(
                                (el) =>
                                    el.type === "book" &&
                                    el.domain &&
                                    el.domain.id === "pale_forgotten_glory"
                            ),
                        ],
                        weapons: [
                            mappedItems.filter(
                                (el) =>
                                    el.type === "weaponMat" &&
                                    el.domain &&
                                    el.domain.id === "cecilia_garden"
                            ),
                            mappedItems.filter(
                                (el) =>
                                    el.type === "weaponMat" &&
                                    el.domain &&
                                    el.domain.id ===
                                        "hidden_palace_of_lianshan_formula"
                            ),
                            mappedItems.filter(
                                (el) =>
                                    el.type === "weaponMat" &&
                                    el.domain &&
                                    el.domain.id === "court_of_flowing_sand"
                            ),
                            mappedItems.filter(
                                (el) =>
                                    el.type === "weaponMat" &&
                                    el.domain &&
                                    el.domain.id === "tower_of_abject_pride"
                            ),
                            mappedItems.filter(
                                (el) =>
                                    el.type === "weaponMat" &&
                                    el.domain &&
                                    el.domain.id === "echoes_of_the_deep_tides"
                            ),
                        ],
                    };

                    return res.send(itemsMap);
                } catch (error) {
                    console.error("getDomainItems threw an error: ", error);
                    return res.status(500).send(error);
                }
            },
        },
    ],
    hooks: {
        afterChange: [
            async ({ doc }) => {
                const revalidateUrl = `${process.env.FRONTEND_URL}/api/revalidate?path=materials&secret=${process.env.FRONTEND_REVALIDATE_SECRET}`;
                const result = await fetch(revalidateUrl);
                if (result.ok) {
                    console.log(`Revalidated materials`);
                } else {
                    console.error(`Failed to revalidate materials`);
                }

                return doc;
            },
        ],
    },
};

export default GenshinItems;
