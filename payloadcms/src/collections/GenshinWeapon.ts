import { CollectionConfig } from "payload/types";
import weaponTypeField from "../fields/WeaponTypeField";
import { GENSHIN_SUBSTATS } from "../constants";

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
                    label: "Crafting",
                    value: "crafting",
                },
                {
                    label: "Open World Exploration", // chests
                    value: "exploration",
                },
                {
                    label: "Other (fishing,..)",
                    value: "other",
                },
            ],
        },
        {
            name: "wishId", // this will be used to match with wishes
            type: "text",
            admin: {
                condition: (data) => {
                    data.wishId = data.name
                        ? data.name.split(" ").join("-").toLowerCase()
                        : "";
                    return false;
                },
            },
        },
        {
            name: "rarity",
            type: "select", // 3,4,5
            options: [
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
            name: "substat",
            type: "select",
            options: GENSHIN_SUBSTATS,
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
