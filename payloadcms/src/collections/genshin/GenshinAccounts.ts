import { CollectionConfig, PayloadRequest, Where } from "payload/types";
import {
    DEFAULT_GENSHIN_WISH_INFO,
    WISH_HISTORY,
    WISH_REGIONS,
} from "../../constants";
import { Response } from "express";
import authMiddleware from "../../api/authMiddleware";
import { GenshinAccount, PublicUser } from "../../../types/payload-types";
import { agenda } from "../../agenda";
import exportWishHistory from "../../api/wishes/exporter";

const validateGenshinAccount = async (req: PayloadRequest) => {
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
    if (!accountId || !user.genshinAccounts.includes(accountId)) {
        return "";
    }
    return accountId;
};

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
                            required: true,
                        },
                        {
                            name: "last4Star",
                            type: "relationship",
                            relationTo: [
                                "genshin-weapons",
                                "genshin-characters",
                            ],
                            required: false,
                        },
                        {
                            name: "last5Star",
                            type: "relationship",
                            relationTo: [
                                "genshin-weapons",
                                "genshin-characters",
                            ],
                            required: false,
                        },
                        {
                            name: "pity4Star",
                            type: "number",
                            required: true,
                        },
                        {
                            name: "pity5Star",
                            type: "number",
                            required: true,
                        },
                        {
                            name: "lastId",
                            type: "text",
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
                            required: true,
                        },
                        {
                            name: "last4Star",
                            type: "relationship",
                            relationTo: [
                                "genshin-weapons",
                                "genshin-characters",
                            ],
                            required: false,
                        },
                        {
                            name: "last5Star",
                            type: "relationship",
                            relationTo: [
                                "genshin-weapons",
                                "genshin-characters",
                            ],
                            required: false,
                        },
                        {
                            name: "pity4Star",
                            type: "number",
                            required: true,
                        },
                        {
                            name: "pity5Star",
                            type: "number",
                            required: true,
                        },
                        {
                            name: "lastId",
                            type: "text",
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
                            required: true,
                        },
                        {
                            name: "last4Star",
                            type: "relationship",
                            relationTo: [
                                "genshin-weapons",
                                "genshin-characters",
                            ],
                            required: false,
                        },
                        {
                            name: "last5Star",
                            type: "relationship",
                            relationTo: [
                                "genshin-weapons",
                                "genshin-characters",
                            ],
                            required: false,
                        },
                        {
                            name: "pity4Star",
                            type: "number",
                            required: true,
                        },
                        {
                            name: "pity5Star",
                            type: "number",
                            required: true,
                        },
                        {
                            name: "lastId",
                            type: "text",
                        },
                    ],
                },
                {
                    name: "lastUpdate",
                    type: "date",
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
                        return res.status(400).send("Invalid body");
                    }
                    try {
                        const account = await req.payload.create({
                            collection: "genshin-accounts",
                            data: {
                                region,
                                hoyoId: hoyoId || "",
                                wishInfo: JSON.parse(
                                    JSON.stringify(DEFAULT_GENSHIN_WISH_INFO)
                                ),
                                importJob: "",
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
                        return res.status(500).send(error);
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
                    let accountId = await validateGenshinAccount(req);
                    if (!accountId) {
                        return res.status(401).send("Unauthorized");
                    }

                    const query = req.query;
                    // pagination and limit
                    let limit = 100;
                    let offset = 1;

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
                            sort: "-wishNumber",
                        });

                        const wishes = wishesReq.docs.map((el) => {
                            const { itemId, genshinAccount, ...rest } = el;
                            const wish = { ...rest };
                            const value = el.itemId.value;
                            let _itemId = null;
                            if (
                                value &&
                                typeof value === "object" &&
                                "icon" in value &&
                                typeof value.icon === "object"
                            ) {
                                _itemId = {
                                    icon: {
                                        alt: value.icon.alt,
                                        url: value.icon.cloudinary.secure_url,
                                        originalName:
                                            value.icon.cloudinary
                                                .original_filename,
                                    },
                                    value: value.name,
                                };
                            }
                            return { ...wish, item: _itemId };
                        });

                        res.send({
                            history: wishes,
                            hasMore: wishesReq.hasNextPage,
                        });
                    } catch (error) {
                        console.error(
                            `/genshin-accounts/getWishHistory/${type} threw an exception: `,
                            error
                        );
                        return res.status(500).send(error);
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
                        let accountId = await validateGenshinAccount(req);
                        if (!accountId) {
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
                            },
                        };

                        res.status(200).send(doc);
                    } catch (error) {
                        console.error(
                            "genshin-accounts/getOverview threw an exception: ",
                            error
                        );
                        return res.status(500).send(error);
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
                    try {
                        if (!query.accountId || !query.link) {
                            return res.status(400).send("Invalid request");
                        }

                        const account = await req.payload.findByID({
                            id: query.accountId,
                            collection: "genshin-accounts",
                            depth: 0,
                        });
                        if (account.importJob) {
                            const importJob =
                                typeof account.importJob === "string"
                                    ? account.importJob
                                    : account.importJob.id;
                            try {
                                await req.payload.delete({
                                    collection: "jobs",
                                    id: importJob,
                                });
                            } catch (error) {
                                // previous job might still exist/being processed
                                // remove it from the db
                                console.error("Found invalid job: ", importJob);
                            }
                        }

                        // create cms job
                        const newJob = await req.payload.create({
                            collection: "jobs",
                            data: {
                                status: "NEW",
                                link: query.link,
                            },
                        });
                        // save cms job id
                        await req.payload.update({
                            collection: "genshin-accounts",
                            id: query.accountId,
                            data: {
                                importJob: newJob.id,
                            },
                        });

                        await agenda.now("wishImporter", {
                            cmsJob: newJob,
                            account: account,
                        });

                        res.send("OK");
                    } catch (error) {
                        console.error(
                            "genshin-accounts/importHistory threw an exception: ",
                            error
                        );
                        return res.status(500).send(error);
                    }
                },
            ],
        },
        {
            path: "/getAccount",
            method: "get",
            handler: [
                authMiddleware,
                async (req: PayloadRequest, res: Response) => {
                    let accountId = await validateGenshinAccount(req);
                    if (!accountId) {
                        return res.status(401).send("Unauthorized");
                    }
                    const doc = await req.payload.findByID({
                        id: accountId,
                        collection: "genshin-accounts",
                    });
                    const wishInfo = doc.wishInfo;
                    const account = {
                        wishInfo: {
                            standard: wishInfo.standard,
                            character: wishInfo.character,
                            weapon: wishInfo.weapon,
                        },
                        accountId,
                    };
                    for (const key of ["character", "weapon", "standard"]) {
                        if (
                            wishInfo[key].last4Star &&
                            wishInfo[key].last4Star.value &&
                            typeof wishInfo[key].last4Star.value === "object"
                        ) {
                            account.wishInfo[key].last4Star =
                                wishInfo[key].last4Star.value.name;
                        }
                        if (
                            wishInfo[key].last5Star &&
                            wishInfo[key].last5Star.value &&
                            typeof wishInfo[key].last5Star.value === "object"
                        ) {
                            account.wishInfo[key].last5Star =
                                wishInfo[key].last5Star.value.name;
                        }
                    }

                    res.send(account);
                },
            ],
        },
        {
            path: "/clearHistory",
            method: "post",
            handler: [
                authMiddleware,
                async (req: PayloadRequest, res: Response) => {
                    const query = req.body;
                    await req.payload.update({
                        collection: "genshin-accounts",
                        id: query.accountId,
                        data: {
                            wishInfo: DEFAULT_GENSHIN_WISH_INFO,
                        },
                    });

                    await req.payload.delete({
                        collection: "genshin-wishes",
                        where: {
                            genshinAccount: { equals: query.accountId },
                        },
                    });
                    res.send("OK");
                },
            ],
        },
        {
            path: "/exportWishHistory",
            method: "get",
            handler: [
                authMiddleware,
                async (req: PayloadRequest, res: Response) => {
                    try {
                        const accountId = await validateGenshinAccount(req);
                        res.setHeader("Content-Type", "application/json");
                        res.setHeader(
                            "Content-Disposition",
                            "attachment; filename=data.json"
                        );
                        // checks if account exists
                        await req.payload.findByID({
                            collection: "genshin-accounts",
                            id: accountId,
                        });
                        res.write("{");
                        await exportWishHistory(accountId, res);
                        res.write("}");
                        res.end();
                    } catch (error) {
                        console.error(
                            "exportWishHistory threw an exception:",
                            error
                        );
                        return res.status(500).send(error);
                    }
                },
            ],
        },
    ],
};

export default GenshinAccounts;
