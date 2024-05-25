import { CollectionConfig, PayloadRequest } from "payload/types";
import weaponTypeField from "../../fields/WeaponTypeField";
import { GENSHIN_SUBSTATS } from "../../constants";
import { genshinSelectField } from "../../fields/fieldsConfig";
import { normalizeName, relationToDictionary } from "../../utils";
import { Response } from "express";

const GenshinWeapons: CollectionConfig = {
    slug: "genshin-weapons",
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
            name: "weaponType",
            type: "select",
            options: [
                {
                    label: "Sword",
                    value: "sword",
                },
                {
                    label: "Catalyst",
                    value: "catalyst",
                },
                {
                    label: "Claymore",
                    value: "claymore",
                },
                {
                    label: "Polearm",
                    value: "polearm",
                },
                {
                    label: "Bow",
                    value: "bow",
                },
            ],
        },
        {
            name: "version",
            type: "text",
        },
        {
            name: "refinements",
            type: "group",
            fields: [
                {
                    name: "name",
                    type: "text",
                },
                {
                    name: "text",
                    type: "text",
                },
                {
                    name: "values",
                    type: "text",
                },
            ],
        },
        {
            name: "domain",
            type: "relationship",
            relationTo: "genshin-items",
            hasMany: true,
        },
        {
            name: "mobDrops",
            type: "group",
            fields: [
                {
                    name: "first",
                    type: "relationship",
                    relationTo: "genshin-items",
                    hasMany: true,
                },
                {
                    name: "second",
                    type: "relationship",
                    relationTo: "genshin-items",
                    hasMany: true,
                },
            ],
        },
        {
            name: "stats",
            type: "group",
            fields: [
                {
                    name: "primary",
                    type: "group",
                    fields: [{ name: "value", type: "number" }],
                },
                {
                    name: "secondary",
                    type: "group",
                    fields: [
                        {
                            name: "value",
                            type: "number",
                        },
                        {
                            name: "stat",
                            type: "select",
                            options: GENSHIN_SUBSTATS,
                        },
                    ],
                },
            ],
        },
        // {
        //     name: "obtainedBy",
        //     type: "select",
        //     options: [
        //         {
        //             label: "Gacha",
        //             value: "gacha",
        //         },
        //         {
        //             label: "Event",
        //             value: "event",
        //         },
        //         {
        //             label: "Batlepass",
        //             value: "batlepass",
        //         },
        //         {
        //             label: "Crafting",
        //             value: "crafting",
        //         },
        //         {
        //             label: "Fishing",
        //             value: "fishing",
        //         },
        //     ],
        // },
        // {
        //     name: "fishingDetails",
        //     type: "group",
        //     fields: [
        //         {
        //             name: "npc",
        //             type: "relationship",
        //             relationTo: "genshin-npcs",
        //         },
        //         {
        //             name: "cost",
        //             type: "array",
        //             fields: [
        //                 genshinSelectField({
        //                     fieldName: "fishId",
        //                     collection: "genshin-items",
        //                     filter: "fish",
        //                 }),
        //                 {
        //                     name: "quantity",
        //                     type: "number",
        //                 },
        //             ],
        //         },
        //     ],
        //     admin: {
        //         condition: (data) => {
        //             return data.obtainedBy === "fishing";
        //         },
        //     },
        // },
        // genshinSelectField({
        //     fieldName: "questId",
        //     collection: "genshin-quests",
        //     visible: (data) => data.obtainedBy === "crafting",
        // }),
        // {
        //     name: "wishId", // this will be used to match with wishes
        //     type: "text",
        //     admin: {
        //         condition: (data) => {
        //             if (data.obtainedBy === "gacha") {
        //                 // only for gacha weapons
        //                 data.wishId = data.name ? normalizeName(data.name) : "";
        //             }
        //             return false;
        //         },
        //     },
        // },
        {
            name: "rarity",
            type: "select", // 3,4,5
            options: [
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
            ],
            required: true,
        },
        // weaponTypeField,
        // {
        //     name: "ascensionMaterials",
        //     type: "group",
        //     fields: [
        //         {
        //             name: "domainDrop",
        //             type: "group",
        //             fields: [
        //                 {
        //                     name: "domainDropId",
        //                     type: "relationship",
        //                     relationTo: "genshin-items",
        //                 },
        //                 {
        //                     name: "quantity",
        //                     type: "number",
        //                 },
        //             ],
        //         },
        //         {
        //             name: "mobDrop",
        //             type: "group",
        //             fields: [
        //                 {
        //                     name: "mobDropId",
        //                     type: "relationship",
        //                     relationTo: "genshin-items",
        //                 },
        //                 {
        //                     name: "quantity",
        //                     type: "number",
        //                 },
        //             ],
        //         },
        //     ],
        // },
        // {
        //     // only for event/fishing weapons that don't use copies of themselves for refinement
        //     name: "refinementMaterial",
        //     type: "relationship",
        //     relationTo: "genshin-items",
        //     admin: {
        //         condition: (data) => {
        //             return (
        //                 data.obtainedBy === "other" ||
        //                 data.obtainedBy === "event"
        //             );
        //         },
        //     },
        //     filterOptions: (data) => {
        //         return {
        //             type: { equals: "weaponAscensionMaterial" },
        //         };
        //     },
        // },
        // {
        //     name: "baseAttack",
        //     type: "number",
        // },
        // {
        //     type: "group",
        //     name: "substat",
        //     fields: [
        //         {
        //             name: "substat",
        //             type: "select",
        //             options: GENSHIN_SUBSTATS,
        //         },
        //         {
        //             name: "value",
        //             type: "number",
        //         },
        //     ],
        // },

        // {
        //     name: "passive",
        //     type: "richText",
        // },
        {
            name: "icon",
            type: "upload",
            relationTo: "media",
            required: true,
        },
    ],
    endpoints: [
        {
            path: "/getWeapons",
            method: "get",
            handler: async (req: PayloadRequest, res: Response) => {
                try {
                    const weaponReq = await req.payload.find({
                        collection: "genshin-weapons",
                        pagination: false,
                        sort: "name",
                    });

                    const weapons = weaponReq.docs.map((weapon) => {
                        const mappedWeapon = {
                            id: weapon.id,
                            name: weapon.name,
                            rarity: Number.parseInt(weapon.rarity),
                            weaponType: weapon.weaponType,
                            version: weapon.version,
                            refinements: {
                                ...weapon.refinements,
                                values: JSON.parse(weapon.refinements.values),
                            },
                            stats: weapon.stats,
                            icon: relationToDictionary(weapon),
                            domain: weapon.domain.map((domain) =>
                                relationToDictionary(domain)
                            ),
                            mobDrops: {
                                first: weapon.mobDrops.first.map((drop) =>
                                    relationToDictionary(drop)
                                ),
                                second: weapon.mobDrops.second.map((drop) =>
                                    relationToDictionary(drop)
                                ),
                            },
                        };
                        if (weapon.icon && typeof weapon.icon === "object") {
                            mappedWeapon["icon"] =
                                weapon.icon.cloudinary.secure_url;
                        }
                        return mappedWeapon;
                    });

                    return res.status(200).send(weapons);
                } catch (error) {
                    return res.status(500).send(error);
                }
            },
        },
    ],
};

export default GenshinWeapons;
