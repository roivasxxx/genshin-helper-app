import { CollectionConfig } from "payload/types";
import { GENSHIN_REGIONS } from "../../constants";

const GenshinQuests: CollectionConfig = {
    slug: "genshin-quests",
    fields: [
        { name: "name", type: "text" },
        { name: "region", type: "select", options: GENSHIN_REGIONS },
        // {name:"rewards",type:"array"}
        { name: "description", type: "richText" },
    ],
};

export default GenshinQuests;
