import { CollectionConfig, PayloadRequest, Where } from "payload/types";
import {
    ALLOWED_EVENT_NOTIFICATIONS,
    WISH_HISTORY,
    WISH_REGIONS,
} from "../../constants";
import { Response } from "express";
import authMiddleware from "../../api/authMiddleware";
import { GenshinAccount, PublicUser } from "../../../types/payload-types";
import { agenda } from "../../agenda";
import payload from "payload";

const genshinAccountBelongsToCurrentUser = async (
    currentUserId: string,
    accountId: string
) => {
    return new Promise(async (res, reject) => {
        if (!accountId || !currentUserId) {
            reject("Invalid account id");
        }
        try {
            const user = await payload.findByID({
                collection: "public-users",
                id: currentUserId,
                depth: 0,
            });
            if (user.genshinAccounts && Array.isArray(user.genshinAccounts)) {
                if (user.genshinAccounts.includes(accountId)) {
                    res(true);
                } else {
                    reject(false);
                }
            }
        } catch (error) {
            reject(error);
        }
    });
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
                            name: "pity",
                            type: "number",
                            required: true,
                        },
                        {
                            name: "last4Star",
                            type: "relationship",
                            relationTo: "genshin-wishes",
                            required: false,
                        },
                        {
                            name: "last5Star",
                            type: "relationship",
                            relationTo: "genshin-wishes",
                            required: false,
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
                            name: "pity",
                            type: "number",
                            required: true,
                        },
                        {
                            name: "last4Star",
                            type: "relationship",
                            relationTo: "genshin-wishes",
                            required: false,
                        },
                        {
                            name: "last5Star",
                            type: "relationship",
                            relationTo: "genshin-wishes",
                            required: false,
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
                            name: "pity",
                            type: "number",
                            required: true,
                        },
                        {
                            name: "last4Star",
                            type: "relationship",
                            relationTo: "genshin-wishes",
                            required: false,
                        },
                        {
                            name: "last5Star",
                            type: "relationship",
                            relationTo: "genshin-wishes",
                            required: false,
                        },
                    ],
                },
                {
                    name: "lastUpdate",
                    type: "date",
                },
                {
                    name: "lastIds",
                    type: "group",
                    fields: [
                        {
                            type: "text",
                            name: "character",
                        },
                        {
                            type: "text",
                            name: "standard",
                        },
                        {
                            type: "text",
                            name: "weapon",
                        },
                    ],
                },
            ],
        },
        {
            name: "importJob",
            type: "relationship",
            relationTo: "jobs",
        },
        {
            name: "tracking",
            type: "group",
            fields: [
                {
                    name: "items",
                    type: "relationship",
                    relationTo: "genshin-items",
                    hasMany: true,
                },
                {
                    name: "events",
                    type: "checkbox",
                },
                {
                    name: "banners",
                    type: "checkbox",
                },
            ],
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
                                wishInfo: {
                                    standard: {
                                        pullCount: 0,
                                        pity: 0,
                                        last4Star: "",
                                        last5Star: "",
                                    },
                                    weapon: {
                                        pullCount: 0,
                                        pity: 0,
                                        last4Star: "",
                                        last5Star: "",
                                    },
                                    character: {
                                        pullCount: 0,
                                        pity: 0,
                                        last4Star: "",
                                        last5Star: "",
                                    },
                                    lastUpdate: "",
                                    lastIds: {
                                        character: "",
                                        standard: "",
                                        weapon: "",
                                    },
                                },
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
                                console.log("Found invalid job: ", importJob);
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
                        const test = await req.payload.update({
                            collection: "genshin-accounts",
                            id: query.accountId,
                            data: {
                                importJob: newJob.id,
                            },
                        });
                        console.log(test);

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
            path: "/setNotificationSettings",
            method: "post",
            handler: [
                authMiddleware,
                async (req: PayloadRequest, res: Response) => {
                    const body = req.body;
                    if (typeof body !== "object") {
                        return res.status(400).send("Invalid body");
                    }
                    const notifications = {
                        events: false,
                        banners: false,
                        items: [],
                    };
                    const genshinAccountId = body.accountId;
                    if (
                        typeof genshinAccountId !== "string" ||
                        genshinAccountId.length === 0
                    ) {
                        return res.status(400).send("Invalid body");
                    }
                    try {
                        await genshinAccountBelongsToCurrentUser(
                            req.user.id,
                            genshinAccountId
                        );
                    } catch (error) {
                        return res.status(401).send("Unauthorized");
                    }

                    if (typeof body.events === "boolean") {
                        notifications.events = body.events;
                    }
                    if (typeof body.banners === "boolean") {
                        notifications.banners = body.banners;
                    }
                    if (body.items && Array.isArray(body.items)) {
                        // check valid domains
                        for (const item of body.items) {
                            if (typeof item === "string") {
                                try {
                                    await payload.findByID({
                                        collection: "genshin-items",
                                        id: item,
                                    });
                                    notifications.items.push(item);
                                } catch (error) {
                                    console.error(
                                        `genshin-accounts/setNotificationSettings: invalid item provided ${item}`
                                    );
                                }
                            }
                        }
                    }

                    try {
                        await req.payload.update({
                            collection: "genshin-accounts",
                            where: {
                                id: {
                                    equals: genshinAccountId,
                                },
                            },
                            data: { tracking: notifications },
                        });
                    } catch (error) {
                        console.error(
                            "genshin-accounts/setNotificationSettings threw an exception when saving notification settings: ",
                            error
                        );
                        return res.status(500).send(error);
                    }
                    res.send("OK");
                },
            ],
        },
    ],
};

export default GenshinAccounts;
