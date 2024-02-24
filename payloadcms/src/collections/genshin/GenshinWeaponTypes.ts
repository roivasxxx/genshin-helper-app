import { CollectionConfig } from "payload/types";

const GenshinWeaponTypes: CollectionConfig = {
    slug: "genshin-weapon-types",
    fields: [
        {
            name: "name",
            type: "text",
        },
        {
            name: "icon",
            type: "upload",
            relationTo: "media",
            required: false,
        },
    ],
};

export default GenshinWeaponTypes;
