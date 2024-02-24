import { CollectionConfig } from "payload/types";
import elementField from "../fields/ElementField";

const GenshinCharacters: CollectionConfig = {
    slug: "genshin-characters",
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        elementField,
    ],
};

export default GenshinCharacters;
