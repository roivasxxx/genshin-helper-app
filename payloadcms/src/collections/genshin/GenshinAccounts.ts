import { CollectionConfig, PayloadRequest, Where } from "payload/types";
import { WISH_HISTORY, WISH_REGIONS } from "../../constants";
import { Response } from "express";
import authMiddleware from "../../api/authMiddleware";
import { GenshinAccount, PublicUser } from "../../../types/payload-types";
import { agenda } from "../../agenda";

const GenshinAccounts: CollectionConfig = {
    slug: "genshin-accounts",
    fields: [
        {
            // region
            name: "region",
            type: "select",
            options: Object.keys(WISH_REGIONS).map((key) => ({
                label: key.toLowerCase(),
                value: WISH_REGIONS[key],
            })),
        },
        {
            // hoyo uuid
            name: "hoyoId",
            type: "text",
        },
        {
            // wish history
            name: "wishInfo",
            type: "group",
            fields: [
                {
                    name: "standard",
                    type: "group",
                    fields: [
                        {
                            name: "pullCount",
                            type: "number",
                        },
                        {
                            name: "pity",
                            type: "number",
                        },
                    ],
                },
                {
                    name: "weapon",
                    type: "group",
                    fields: [
                        {
                            name: "pullCount",
                            type: "number",
                        },
                        {
                            name: "pity",
                            type: "number",
                        },
                    ],
                },
                {
                    name: "character",
                    type: "group",
                    fields: [
                        {
                            name: "pullCount",
                            type: "number",
                        },
                        {
                            name: "pity",
                            type: "number",
                        },
                    ],
                },
                {
                    name: "lastUpdate",
                    type: "date",
                },
                {
                    name: "last4Star",
                    type: "relationship",
                    relationTo: "genshin-wishes",
                },
                {
                    name: "last5Star",
                    type: "relationship",
                    relationTo: "genshin-wishes",
                },
            ],
        },
        {
            name: "importJob",
            type: "relationship",
            relationTo: "jobs",
        },
    ],
    endpoints: [
        {
            path: "/create-genshin-account",
            method: "post",
            handler: [
                authMiddleware,
                async (req: PayloadRequest, res: Response) => {
                    const { region, hoyoId } = req.body;
                    if (!region) {
                        res.status(400).send("Invalid body");
                    }
                    try {
                        const account = await req.payload.create({
                            collection: "genshin-accounts",
                            data: {
                                region,
                                hoyoId: hoyoId || "",
                                wishInfo: {
                                    standard: {
                                        pullCount: 0,
                                        pity: 0,
                                    },
                                    weapon: {
                                        pullCount: 0,
                                        pity: 0,
                                    },
                                    character: {
                                        pullCount: 0,
                                        pity: 0,
                                    },
                                },
                            },
                        });

                        const currentUser = await req.payload.findByID({
                            collection: "public-users",
                            id: req.user.id,
                            // returns relationships as strings - uuids
                            depth: 0,
                        });
                        const currentAccounts = (currentUser.genshinAccounts ||
                            []) as string[];

                        req.payload.update({
                            id: req.user.id,
                            collection: "public-users",
                            data: {
                                genshinAccounts: [
                                    ...currentAccounts,
                                    account.id,
                                ],
                            },
                        });
                        res.send({ accountId: account.id });
                    } catch (error) {
                        console.error(
                            "genshin-accounts/create-genshin-account threw an error: ",
                            error
                        );
                        res.status(500).send(error);
                    }
                },
            ],
        },
        {
            path: "/getWishHistory",
            method: "get",
            handler: [
                authMiddleware,
                async (req: PayloadRequest, res: Response) => {
                    const user: PublicUser = await req.payload.findByID({
                        collection: "public-users",
                        id: req.user.id,
                        depth: 0,
                    });
                    let accountId = "";

                    if (typeof req.query.accountId === "string") {
                        accountId = req.query.accountId;
                    } else if (
                        Array.isArray(req.query.accountId) &&
                        typeof req.query.accountId[0] === "string"
                    ) {
                        accountId = req.query.accountId[0];
                    }

                    if (
                        !accountId ||
                        !user.genshinAccounts.includes(accountId)
                    ) {
                        return res.status(401).send("Unauthorized");
                    }

                    const query = req.query;
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
                        const wishesReq = await req.payload.find({
                            collection: "genshin-wishes",
                            where: where,
                            limit: limit,
                            page: offset,
                        });

                        res.send(wishesReq.docs);
                    } catch (error) {
                        console.error(
                            `/genshin-accounts/getWishHistory/${type} threw an exception: `,
                            error
                        );
                        res.status(500).send(error);
                    }
                },
            ],
        },
        {
            path: "/getOverview",
            method: "get",
            handler: [
                authMiddleware,
                async (req: PayloadRequest, res: Response) => {
                    try {
                        const user: PublicUser = await req.payload.findByID({
                            collection: "public-users",
                            id: req.user.id,
                            depth: 0,
                        });
                        let accountId = "";

                        if (typeof req.query.accountId === "string") {
                            accountId = req.query.accountId;
                        } else if (
                            Array.isArray(req.query.accountId) &&
                            typeof req.query.accountId[0] === "string"
                        ) {
                            accountId = req.query.accountId[0];
                        }

                        if (
                            !accountId ||
                            !user.genshinAccounts.includes(accountId)
                        ) {
                            return res.status(401).send("Unauthorized");
                        }

                        const acc: GenshinAccount = await req.payload.findByID({
                            id: accountId,
                            collection: "genshin-accounts",
                        });

                        const doc = {
                            hoyoId: acc.hoyoId,
                            region: acc.region,
                            wishInfo: {
                                ...acc.wishInfo,
                                lastUpdated: acc.wishInfo.lastUpdate || null,
                                last4Star: acc.wishInfo.last4Star || null,
                                last5Star: acc.wishInfo.last5Star || null,
                            },
                        };

                        res.status(200).send(doc);
                    } catch (error) {
                        console.error(
                            "genshin-accounts/getOverview threw an exception: ",
                            error
                        );
                        res.status(500).send(error);
                    }
                },
            ],
        },
        {
            path: "/importHistory",
            method: "post",
            handler: [
                authMiddleware,
                async (req: PayloadRequest, res: Response) => {
                    const query = req.body;
                    // create cms job
                    const newJob = await req.payload.create({
                        collection: "jobs",
                        data: {
                            status: "NEW",
                        },
                    });
                    // save cms job id
                    // await req.payload.update({
                    //     collection: "genshin-accounts",
                    //     id: query.accountId,
                    //     data: {
                    //         importJob: newJob.id,
                    //     },
                    // });

                    await agenda.now("wishImporter", {
                        cmsJob: newJob.id,
                        link: query.link,
                    });

                    res.send("OK");
                },
            ],
        },
    ],
};

export default GenshinAccounts;
