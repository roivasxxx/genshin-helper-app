import { CollectionConfig } from "payload/types";
import weaponTypeField from "../../fields/WeaponTypeField";
import { GENSHIN_SUBSTATS } from "../../constants";
import { genshinSelectField } from "../../fields/fieldsConfig";
import { normalizeName } from "../../utils";

const GenshinWeapons: CollectionConfig = {
    slug: "genshin-weapons",
    fields: [
        {
            name: "name",
            type: "text",
        },
        {
            name: "obtainedBy",
            type: "select",
            options: [
                {
                    label: "Gacha",
                    value: "gacha",
                },
                {
                    label: "Event",
                    value: "event",
                },
                {
                    label: "Batlepass",
                    value: "batlepass",
                },
                {
                    label: "Crafting",
                    value: "crafting",
                },
                {
                    label: "Fishing",
                    value: "fishing",
                },
            ],
        },
        {
            name: "fishingDetails",
            type: "group",
            fields: [
                {
                    name: "npc",
                    type: "relationship",
                    relationTo: "genshin-npcs",
                },
                {
                    name: "cost",
                    type: "array",
                    fields: [
                        genshinSelectField({
                            fieldName: "fishId",
                            collection: "genshin-items",
                            filter: "fish",
                        }),
                        {
                            name: "quantity",
                            type: "number",
                        },
                    ],
                },
            ],
            admin: {
                condition: (data) => {
                    return data.obtainedBy === "fishing";
                },
            },
        },
        genshinSelectField({
            fieldName: "questId",
            collection: "genshin-quests",
            visible: (data) => data.obtainedBy === "crafting",
        }),
        {
            name: "wishId", // this will be used to match with wishes
            type: "text",
            admin: {
                condition: (data) => {
                    if (data.obtainedBy === "gacha") {
                        // only for gacha weapons
                        data.wishId = data.name ? normalizeName(data.name) : "";
                    }
                    return false;
                },
            },
        },
        {
            name: "rarity",
            type: "select", // 3,4,5
            options: [
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
            ],
        },
        weaponTypeField,
        {
            name: "ascensionMaterials",
            type: "group",
            fields: [
                {
                    name: "domainDrop",
                    type: "group",
                    fields: [
                        {
                            name: "domainDropId",
                            type: "relationship",
                            relationTo: "genshin-items",
                        },
                        {
                            name: "quantity",
                            type: "number",
                        },
                    ],
                },
                {
                    name: "mobDrop",
                    type: "group",
                    fields: [
                        {
                            name: "mobDropId",
                            type: "relationship",
                            relationTo: "genshin-items",
                        },
                        {
                            name: "quantity",
                            type: "number",
                        },
                    ],
                },
            ],
        },
        {
            // only for event/fishing weapons that don't use copies of themselves for refinement
            name: "refinementMaterial",
            type: "relationship",
            relationTo: "genshin-items",
            admin: {
                condition: (data) => {
                    return (
                        data.obtainedBy === "other" ||
                        data.obtainedBy === "event"
                    );
                },
            },
            filterOptions: (data) => {
                return {
                    type: { equals: "weaponAscensionMaterial" },
                };
            },
        },
        {
            name: "baseAttack",
            type: "number",
        },
        {
            type: "group",
            name: "substat",
            fields: [
                {
                    name: "substat",
                    type: "select",
                    options: GENSHIN_SUBSTATS,
                },
                {
                    name: "value",
                    type: "number",
                },
            ],
        },

        {
            name: "passive",
            type: "richText",
        },
        {
            name: "icon",
            type: "upload",
            relationTo: "media",
            required: false,
        },
    ],
};

export default GenshinWeapons;
