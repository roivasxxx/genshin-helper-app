import { CollectionConfig } from "payload/types";
import elementField from "../../fields/ElementField";
import weaponTypeField from "../../fields/WeaponTypeField";
import { GENSHIN_REGIONS, RARITY_LABELS } from "../../constants";
import { genshinSelectField } from "../../fields/fieldsConfig";

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
};

export default GenshinCharacters;
