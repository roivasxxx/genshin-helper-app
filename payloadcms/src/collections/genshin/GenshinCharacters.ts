import { CollectionConfig } from "payload/types";
import elementField from "../../fields/ElementField";
import weaponTypeField from "../../fields/WeaponTypeField";
import { GENSHIN_REGIONS } from "../../constants";
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
            name: "region",
            type: "select",
            options: GENSHIN_REGIONS,
        },
        elementField,
        weaponTypeField,
        genshinSelectField({
            collection: "genshin-domain-items",
            fieldName: "talentBook",
            filter: { type: { equals: "book" } },
        }),
        genshinSelectField({
            collection: "genshin-mob-drops",
            fieldName: "talentMobDrop",
            // regular mob drops only
            filter: { mobType: { equals: "regular" } },
            isMultiSelect: true,
            hasMany: true,
        }),
        genshinSelectField({
            collection: "genshin-mob-drops",
            fieldName: "bossMobDrop",
            // regular mob drops only
            filter: { mobType: { equals: "boss" } },
            isMultiSelect: true,
        }),
        genshinSelectField({
            collection: "genshin-mob-drops",
            fieldName: "trounceMobDrop",
            // regular mob drops only
            filter: { mobType: { equals: "trounce" } },
            isMultiSelect: true,
        }),
        // TODO: create other fields
        // books, talentMat, collectibleItem, bossDrop, trounceDrop, autoattack, skill, burst, ascension, c1,...c6, passives
    ],
};

export default GenshinCharacters;
