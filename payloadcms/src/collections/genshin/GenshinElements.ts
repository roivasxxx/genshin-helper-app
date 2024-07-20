import { CollectionConfig, PayloadRequest } from "payload/types";
import authMiddleware from "../../api/authMiddleware";
import { Response } from "express";

const GenshinElements: CollectionConfig = {
    slug: "genshin-elements",
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
            name: "icon",
            type: "upload",
            relationTo: "media",
            required: true,
        },
    ],
    endpoints: [
        {
            path: "/getElements",
            method: "get",
            handler: [
                async (req: PayloadRequest, res: Response) => {
                    const elements = await req.payload.find({
                        collection: "genshin-elements",
                        sort: "name",
                    });

                    const elementsMapped = elements.docs.map((el) => {
                        const element = {
                            name: el.name,
                            id: el.id,
                        };
                        if (typeof el.icon === "object") {
                            element["icon"] = el.icon.cloudinary.secure_url;
                        }
                        return element;
                    });
                    res.send(elementsMapped);
                },
            ],
        },
    ],
};

export default GenshinElements;
