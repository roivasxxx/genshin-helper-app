import { Field } from "payload/types";
import WeaponTypeField from "./components/WeaponTypeField";

const weaponField: Field = {
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

export default weaponField;
