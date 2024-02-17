import { CollectionConfig } from "payload/types";

const GenshinCharacters: CollectionConfig = {
    slug: "genshin-characters",
    fields: [
        {
            name: "name",
            type: "text",
        },
        {
            name: "element_type",
            type: "text",
        },
    ],
};

export default GenshinCharacters;
