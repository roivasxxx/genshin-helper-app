import { CollectionConfig } from "payload/types";
import { RARITY_LABELS } from "../../constants";

const GenshinArtifact: CollectionConfig = {
    slug: "genshin-artifacts",
    fields: [
        {
            name: "id",
            type: "text",
        },
        {
            name: "name",
            type: "text",
        },
        {
            name: "icon",
            type: "upload",
            relationTo: "media",
            required: false,
        },
        {
            name: "domain",
            type: "relationship",
            relationTo: "genshin-domains",
            required: true,
        },
        {
            name: "rarity",
            type: "select",
            options: RARITY_LABELS(1, 5),
        },
        {
            name: "2pc", // 2 piece bonus
            type: "text",
        },
        {
            name: "4pc", // 4 piece bonus
            type: "text",
        },
    ],
};

export default GenshinArtifact;
