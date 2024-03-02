import { Field } from "payload/types";
import WeaponField from "./components/WeaponField";

/**
 *
 * @param min - min characters - default 1
 * @param max - max characters - default 4
 * @returns
 */
const weaponField = ({
    min = 1,
    max = 4,
    visible = () => true,
}: {
    min?: number;
    max?: number;
    visible: (...args) => boolean;
}): Field => {
    return {
        name: "weaponIds",
        type: "relationship",
        relationTo: "genshin-weapons",
        required: true,
        minRows: min,
        maxRows: max,
        admin: {
            condition: visible,
            components: {
                Field: WeaponField,
            },
        },
        hasMany: true,
    };
};

export default weaponField;
