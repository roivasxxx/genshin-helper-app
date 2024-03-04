import { CollectionConfig } from "payload/types";
import { GENSHIN_REGIONS } from "../../constants";
import { genshinSelectField } from "../../fields/fieldsConfig";

const GenshinQuests: CollectionConfig = {
    slug: "genshin-quests",
    fields: [
        { name: "name", type: "text" },
        { name: "region", type: "select", options: GENSHIN_REGIONS },
        // {name:"rewards",type:"array"}
        { name: "description", type: "richText" },
        genshinSelectField({
            collection: "genshin-quests",
            fieldName: "questIds",
            hasMany: true,
        }),
    ],
};

export default GenshinQuests;
