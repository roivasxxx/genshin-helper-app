import { CollectionConfig, PayloadRequest } from "payload/types";
import { GENSHIN_REGIONS, RARITY_LABELS } from "../../constants";
import { Response } from "express";
import { GenshinCharacter } from "../../../types/payload-types";
import payload from "payload";

const addCharExtra = async (
    char: GenshinCharacter,
    newChar: ReturnType<typeof normalizeChar>
) => {
    if (char.splash && typeof char.splash === "object") {
        newChar["splash"] = char.splash.cloudinary.secure_url;
    }

    const eventProperty = char.rarity === "5" ? "fiveStar" : "fourStar";

    const events = await payload.find({
        collection: "genshin-events",
        where: {
            and: [
                {
                    bannerType: {
                        equals: "character",
                    },
                },
                {
                    [`characters.${eventProperty}`]: {
                        contains: char.id,
                    },
                },
            ],
        },
        sort: "-end",
    });
    newChar.events.push(
        ...events.docs.map((e) => {
            return {
                id: e.id,
                start: e.start,
                end: e.end,
                version: e.version,
                timezoneDependent: e.timezoneDependent,
                characters: {
                    fiveStar: e.characters.fiveStar.map((char) => {
                        if (
                            typeof char === "object" &&
                            typeof char.icon === "object"
                        ) {
                            return {
                                id: char.id,
                                name: char.name,
                                icon: char.icon.cloudinary.secure_url,
                            };
                        }
                        return char;
                    }),
                    fourStar: e.characters.fourStar.map((char) => {
                        if (
                            typeof char === "object" &&
                            typeof char.icon === "object"
                        ) {
                            return {
                                id: char.id,
                                name: char.name,
                                icon: char.icon.cloudinary.secure_url,
                            };
                        }
                        return char;
                    }),
                },
            };
        })
    );
};

const normalizeChar = (char: GenshinCharacter) => {
    const newChar = {
        id: char.id,
        name: char.name,
        weaponType: char.weaponType || "sword",
        substat: char.substat,
        rarity: Number.parseInt(char.rarity),
        birthday: char.birthday,
        events: [],
        patch: char.patch,
    };
    if (char.icon && typeof char.icon === "object") {
        newChar["icon"] = char.icon.cloudinary.secure_url;
    }

    if (
        char.element &&
        typeof char.element === "object" &&
        char.element.icon &&
        typeof char.element.icon === "object"
    ) {
        newChar["element"] = {
            name: char.element.name,
            icon: char.element.icon.cloudinary.secure_url,
            id: char.element.id,
        };
    }

    if (
        char.specialty &&
        typeof char.specialty === "object" &&
        char.specialty.icon &&
        typeof char.specialty.icon === "object"
    ) {
        newChar["specialty"] = {
            name: char.specialty.name,
            icon: char.specialty.icon.cloudinary.secure_url,
        };
    }
    if (
        char.boss &&
        typeof char.boss === "object" &&
        char.boss.icon &&
        typeof char.boss.icon === "object"
    ) {
        newChar["boss"] = {
            name: char.boss.name,
            icon: char.boss.icon.cloudinary.secure_url,
        };
    }
    if (
        char.talent &&
        typeof char.talent === "object" &&
        char.talent.icon &&
        typeof char.talent.icon === "object"
    ) {
        newChar["talent"] = {
            name: char.talent.name,
            icon: char.talent.icon.cloudinary.secure_url,
        };
    }

    if (
        char.trounce &&
        typeof char.trounce === "object" &&
        char.trounce.icon &&
        typeof char.trounce.icon === "object"
    ) {
        newChar["trounce"] = {
            name: char.trounce.name,
            icon: char.trounce.icon.cloudinary.secure_url,
        };
    }

    if (
        char.gem &&
        typeof char.gem === "object" &&
        char.gem.icon &&
        typeof char.gem.icon === "object"
    ) {
        newChar["gem"] = {
            name: char.gem.name,
            icon: char.gem.icon.cloudinary.secure_url,
        };
    }

    if (char.books && Array.isArray(char.books)) {
        newChar["books"] = char.books.map((book) => {
            if (
                typeof book === "object" &&
                book.icon &&
                typeof book.icon === "object"
            ) {
                return {
                    name: book.name,
                    icon: book.icon.cloudinary.secure_url,
                };
            }
        });
    }

    return newChar;
};

const GenshinCharacters: CollectionConfig = {
    slug: "genshin-characters",
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "id",
            type: "text",
        },
        {
            name: "region",
            type: "select",
            options: GENSHIN_REGIONS,
        },
        {
            name: "rarity",
            type: "select",
            options: RARITY_LABELS(4, 5),
        },
        {
            name: "icon",
            type: "upload",
            relationTo: "media",
            required: true,
        },
        {
            name: "splash",
            type: "upload",
            relationTo: "media",
            required: true,
        },
        {
            name: "specialty",
            type: "relationship",
            relationTo: "genshin-items",
        },
        {
            name: "talent",
            type: "relationship",
            relationTo: "genshin-items",
        },
        {
            name: "trounce",
            type: "relationship",
            relationTo: "genshin-items",
        },
        {
            name: "boss",
            type: "relationship",
            relationTo: "genshin-items",
        },
        {
            name: "books",
            type: "relationship",
            relationTo: "genshin-items",
            hasMany: true,
        },
        {
            name: "weaponType",
            type: "text", // change to select
        },
        {
            name: "substat",
            type: "text", // change to select
        },
        {
            name: "element",
            type: "relationship",
            relationTo: "genshin-elements",
        },
        {
            name: "gem",
            type: "relationship",
            relationTo: "genshin-items",
        },
        {
            name: "birthday",
            type: "text",
        },
        {
            name: "patch",
            type: "text",
        },
        // elementField,
        // weaponTypeField,
        // {
        //     name: "released",
        //     type: "relationship",
        //     relationTo: "genshin-patches",
        // },
        // {
        //     name: "drops",
        //     type: "group",
        //     fields: [
        //         genshinSelectField({
        //             collection: "genshin-domain-items",
        //             fieldName: "talentBook",
        //             filter: { type: { equals: "book" } },
        //         }),
        //         genshinSelectField({
        //             collection: "genshin-mob-drops",
        //             fieldName: "talentMobDrop",
        //             // regular mob drops only
        //             filter: { mobType: { equals: "regular" } },
        //             isMultiSelect: true,
        //             hasMany: true,
        //         }),
        //         genshinSelectField({
        //             collection: "genshin-mob-drops",
        //             fieldName: "bossMobDrop",
        //             // regular mob drops only
        //             filter: { mobType: { equals: "boss" } },
        //             isMultiSelect: true,
        //         }),
        //         genshinSelectField({
        //             collection: "genshin-mob-drops",
        //             fieldName: "trounceMobDrop",
        //             // regular mob drops only
        //             filter: { mobType: { equals: "trounce" } },
        //             isMultiSelect: true,
        //         }),
        //     ],
        // },
        // {
        //     type: "group",
        //     name: "talents",
        //     fields: [
        //         {
        //             name: "autoattack",
        //             type: "richText",
        //         },
        //         {
        //             name: "elementalSkill",
        //             type: "richText",
        //         },
        //         {
        //             name: "elementalBurst",
        //             type: "richText",
        //         },
        //     ],
        // },
        // {
        //     type: "array",
        //     name: "ascensionSkils",
        //     fields: [
        //         {
        //             name: "name",
        //             type: "richText",
        //         },
        //         {
        //             // lvl of unlocking
        //             name: "unlockedAt",
        //             type: "number",
        //         },
        //         {
        //             name: "description",
        //             type: "richText",
        //         },
        //     ],
        // },
        // {
        //     name: "constellation",
        //     type: "group",
        //     fields: [
        //         {
        //             name: "constellations",
        //             type: "array",
        //             fields: [
        //                 {
        //                     name: "constellation",
        //                     type: "number",
        //                 },
        //                 {
        //                     name: "name",
        //                     type: "richText",
        //                 },
        //                 {
        //                     name: "description",
        //                     type: "richText",
        //                 },
        //                 {
        //                     name: "icon",
        //                     type: "upload",
        //                     relationTo: "media",
        //                 },
        //             ],
        //         },
        //         {
        //             name: "image",
        //             type: "upload",
        //             relationTo: "media",
        //         },
        //     ],
        // },
        // TODO: create other fields
        // books, talentMat, collectibleItem, bossDrop, trounceDrop, autoattack, skill, burst, ascension, c1,...c6, passives
    ],
    endpoints: [
        {
            path: "/getGenshinCharacters",
            method: "get",
            handler: [
                async (req: PayloadRequest, res: Response) => {
                    try {
                        const chars = await req.payload.find({
                            collection: "genshin-characters",
                            pagination: false,
                            sort: "name",
                        });
                        if (chars.docs && chars.docs.length > 0) {
                            const mappedChars = chars.docs.map(normalizeChar);
                            return res.send(mappedChars);
                        }
                        return res.send([]);
                    } catch (error) {
                        res.status(500).send(error);
                        console.error(
                            "/getGenshinCharacters threw an error: ",
                            error
                        );
                    }
                },
            ],
        },
        {
            path: "/getGenshinCharacter",
            method: "get",
            handler: [
                async (req: PayloadRequest, res: Response) => {
                    try {
                        const { id } = req.query;
                        if (typeof id !== "string") {
                            return res.status(400).send("Invalid id");
                        }
                        const character = await req.payload.findByID({
                            collection: "genshin-characters",
                            id: id,
                        });

                        const _normalized_character = normalizeChar(character);
                        await addCharExtra(character, _normalized_character);
                        return res.send(_normalized_character);
                    } catch (error) {
                        res.status(500).send(error);
                        console.error(
                            "/getGenshinCharacter threw an error: ",
                            error
                        );
                    }
                },
            ],
        },
    ],
};

export default GenshinCharacters;
