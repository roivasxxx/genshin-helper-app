import { Field } from "payload/types";
import CharacterField from "./components/CharacterField";

/**
 *
 * @param min - min characters - default 1
 * @param max - max characters - default 4
 * @returns
 */
const characterField = ({
    min = 1,
    max = 4,
    visible = () => true,
}: {
    min?: number;
    max?: number;
    visible: (...args) => boolean;
}): Field => {
    return {
        name: "characterIds",
        type: "relationship",
        relationTo: "genshin-characters",
        required: true,
        minRows: min,
        maxRows: max,
        admin: {
            condition: visible,
            components: {
                Field: CharacterField,
            },
        },
        hasMany: true,
    };
};

export default characterField;
