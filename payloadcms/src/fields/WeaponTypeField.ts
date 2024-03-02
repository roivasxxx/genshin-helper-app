import { Field } from "payload/types";
import WeaponTypeField from "./components/WeaponTypeField";

const weaponTypeField: Field = {
    name: "weapon-type",
    type: "relationship",
    relationTo: "genshin-weapon-types",
    required: true,
    admin: {
        components: {
            Field: WeaponTypeField,
        },
    },
};

export default weaponTypeField;
