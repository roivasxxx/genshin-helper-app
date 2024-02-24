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
    ],
};

export default GenshinCharacters;
