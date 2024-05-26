import { CollectionConfig, PayloadRequest } from "payload/types";
import { RARITY_LABELS } from "../../constants";
import { Response } from "express";
import { relationToDictionary } from "../../utils";

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
            required: true,
        },
        {
            name: "setPiece",
            type: "number",
            hasMany: true,
        },
        {
            name: "icon",
            type: "upload",
            relationTo: "media",
            required: true,
        },
        {
            name: "domains",
            type: "relationship",
            relationTo: "genshin-domains",
            required: false,
            hasMany: true,
        },
        {
            name: "rarity",
            type: "number",
            hasMany: true,
        },
        {
            name: "bonuses",
            type: "text",
            hasMany: true,
        },
    ],
    endpoints: [
        {
            path: "/getArtifacts",
            method: "get",
            handler: async (req: PayloadRequest, res: Response) => {
                try {
                    const artifactsReq = await req.payload.find({
                        collection: "genshin-artifacts",
                        pagination: false,
                        sort: "name",
                    });

                    const artifacts = artifactsReq.docs.map((artifact) => {
                        const { domains, ...rest } = artifact;
                        const mappedArtifact = {
                            ...rest,
                            ...relationToDictionary(rest),
                        };

                        if (
                            artifact.domains &&
                            typeof artifact.domains !== "string"
                        ) {
                            mappedArtifact["domains"] = domains
                                .filter((domain) => typeof domain !== "string")
                                .map((domain) => {
                                    if (typeof domain !== "string") {
                                        return {
                                            name: domain.name,
                                            id: domain.id,
                                        };
                                    }
                                });
                        }

                        return mappedArtifact;
                    });
                    res.status(200).send(artifacts);
                } catch (error) {
                    console.error("getArtifacts threw an exception", error);
                    return res.status(500).send(error);
                }
            },
        },
    ],
};

export default GenshinArtifact;
