import { CollectionConfig } from "payload/types";
import elementField from "../../fields/ElementField";
import weaponField from "../../fields/WeaponField";

const GenshinCharacters: CollectionConfig = {
    slug: "genshin-characters",
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        elementField,
        weaponField,
        // TODO: create other fields
        // books, talentMat, collectibleItem, bossDrop, trounceDrop, autoattack, skill, burst, ascension, c1,...c6, passives
    ],
};

export default GenshinCharacters;
