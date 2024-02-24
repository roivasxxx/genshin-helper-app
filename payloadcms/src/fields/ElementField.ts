import { Field } from "payload/types";
import ElementField from "./components/ElementField";

const elementField: Field = {
    name: "element",
    type: "relationship",
    relationTo: "genshin-elements",
    required: true,
    admin: {
        components: {
            Field: ElementField,
        },
    },
};

export default elementField;
