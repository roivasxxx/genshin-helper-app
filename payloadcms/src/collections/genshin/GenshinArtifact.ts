import { CollectionConfig } from "payload/types";

const GenshinArtifact: CollectionConfig = {
    slug: "genshin-artifact",
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
            relationTo: "genshin-domain",
            required: true,
        },
    ],
};

export default GenshinArtifact;
