import { CollectionConfig } from "payload/types";
import { genshinItemConfig } from "../../fields/fieldsConfig";

const GenshinElements: CollectionConfig = {
    slug: "genshin-elements",
    fields: [
        {
            name: "name",
            type: "text",
        },
        {
            name: "icon",
            type: "upload",
            relationTo: "media",
            required: true,
        },

        genshinItemConfig({ fieldName: "test" }),
    ],
};

export default GenshinElements;
