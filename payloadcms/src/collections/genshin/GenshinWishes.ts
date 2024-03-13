import { Response } from "express";
import { CollectionConfig, PayloadRequest, Where } from "payload/types";
import { WISH_HISTORY } from "../../constants";
import payload from "payload";
import authMiddleware from "../../authMiddleware";

const GenshinWishes: CollectionConfig = {
    slug: "genshin-wishes",
    fields: [
        {
            name: "bannerType",
            type: "select",
            options: [
                {
                    label: "Character",
                    value: "character",
                },
                {
                    label: "Weapon",
                    value: "weapon",
                },
                {
                    label: "Standard",
                    value: "standard",
                },
            ],
        },
        {
            name: "date",
            type: "date",
        },
        {
            // 1 for 3 stars, 2-10 for 4 stars, 2-90 for 5 stars
            name: "pity",
            type: "number",
        },
        {
            // returned from hoyo api
            name: "hoyoId",
            type: "text",
        },
        {
            // this will be filled in based on the date -> find which banner was active during specified date
            // only for non-standard pulls
            name: "banner",
            type: "relationship",
            relationTo: "genshin-events",
            admin: {
                condition: (data) => {
                    return data?.bannerType !== "standard";
                },
            },
            filterOptions: () => {
                return {
                    type: { equals: "banner" },
                };
            },
        },
        {
            name: "genshinAccount",
            type: "relationship",
            relationTo: "genshin-accounts",
        },
        {
            // id of character/weapon document
            // getWishHistory has to reduce information obtained from this relationship
            name: "itemId",
            type: "relationship",
            relationTo: ["genshin-characters", "genshin-weapons"],
        },
        {
            // userId + bannerType + wishNumber - userId-standard-0, userId-weapon-1,...
            // use for querying, sorting
            name: "wishId",
            type: "text",
            admin: {
                condition: () => false,
            },
        },
    ],
    endpoints: [
        {
            path: "/getWishHistory",
            method: "get",
            handler: [
                authMiddleware,
                async (req: PayloadRequest, res: Response) => {
                    if (!req.params.accountId) {
                        return res.status(401).send("Unauthorized");
                    }

                    const query = req.query;
                    const accountId = query.accountId;
                    // pagination and limit
                    let limit = 100;
                    let offset = 0;

                    if (query.limit) {
                        if (typeof query.limit === "string") {
                            limit = parseInt(query.limit);
                        } else if (
                            Array.isArray(query.limit) &&
                            typeof query.limit[0] === "string"
                        ) {
                            limit = parseInt(query.limit[0]);
                        }
                    }
                    if (query.offset) {
                        if (typeof query.offset === "string") {
                            offset = parseInt(query.offset);
                        } else if (
                            Array.isArray(query.offset) &&
                            typeof query.offset[0] === "string"
                        ) {
                            offset = parseInt(query.offset[0]);
                        }
                    }

                    const type = query.type || WISH_HISTORY.STANDARD;

                    const where: Where = {
                        and: [
                            { genshinAccount: { equals: accountId } },
                            { bannerType: { equals: type } },
                        ],
                    };

                    try {
                        const wishesReq = await payload.find({
                            collection: "genshin-wishes",
                            where: where,
                            limit: limit,
                            page: offset,
                        });

                        res.send(wishesReq.docs);
                    } catch (error) {
                        console.error(
                            `/getWishHistory/${type} threw an exception: `,
                            error
                        );
                    }
                },
            ],
        },
    ],
};

export default GenshinWishes;
