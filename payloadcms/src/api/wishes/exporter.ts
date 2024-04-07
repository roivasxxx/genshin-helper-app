import { Response } from "express";
import payload from "payload";
import { WISH_HISTORY } from "../../constants";
import { GenshinWish } from "../../../types/payload-types";

export default async function exportWishHistory(
    accountId: string,
    res: Response
) {
    await writeBanner(accountId, WISH_HISTORY.STANDARD, res);
    res.write(",");
    await writeBanner(accountId, WISH_HISTORY.CHARACTER, res);
    res.write(",");
    await writeBanner(accountId, WISH_HISTORY.WEAPON, res);
}

const writeBanner = async (
    accountId: string,
    banner: WISH_HISTORY,
    res: Response
) => {
    let hasMore = true;
    let offset = 1;
    res.write(`\"${banner}\":[`);
    while (hasMore) {
        try {
            const wishesReq = await payload.find({
                collection: "genshin-wishes",
                where: {
                    and: [
                        { genshinAccount: { equals: accountId } },
                        {
                            bannerType: {
                                equals: banner,
                            },
                        },
                    ],
                },
                limit: 50,
                page: offset,
                sort: "-wishNumber",
            });
            if (offset > 1) {
                res.write(",");
            }
            res.write(wishesReq.docs.map(stringifyWish).join(","));
            hasMore = wishesReq.hasNextPage;
            offset++;
        } catch (error) {
            hasMore = false;
        }
    }
    res.write("]");
};

const stringifyWish = (wish: GenshinWish) => {
    const value = wish.itemId.value;
    if (typeof value === "object" && "name" in value && "id" in value) {
        {
            const _wish = {
                date: wish.date,
                item: value.name,
                itemId: value.id,
                rarity: wish.rarity,
                id: wish.hoyoId,
                bannerType: wish.bannerType,
                pity: wish.pity,
                wishnumber: wish.wishNumber,
            };

            return JSON.stringify(_wish);
        }
    }
};
