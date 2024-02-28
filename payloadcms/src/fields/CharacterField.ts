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
}: {
    min?: number;
    max?: number;
}): Field => {
    return {
        name: "characterIds",
        type: "relationship",
        relationTo: "genshin-characters",
        required: true,
        minRows: min,
        maxRows: max,
        admin: {
            components: {
                Field: CharacterField,
            },
        },
        hasMany: true,
    };
};

export default characterField;
