import { CollectionConfig } from "payload/types";

const GenshinArtifact: CollectionConfig = {
    slug: "genshin-artifacts",
    fields: [
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
    ],
};

export default GenshinArtifact;
