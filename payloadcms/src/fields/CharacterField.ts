import { Field } from "payload/types";
import CharacterField from "./components/CharacterField";

const characterField = (): Field => {
    return {
        name: "characterIds",
        type: "relationship",
        relationTo: "genshin-characters",
        required: true,
        admin: {
            components: {
                Field: CharacterField,
            },
        },
        hasMany: true,
    };
};

export default characterField;
