import axios from "axios";
import {
    HOYO_WISH_API_URL,
    WISH_BANNER_CODES,
    WISH_HISTORY,
} from "../../constants";
import { normalizeName, sleep } from "../../utils";
import {
    GenshinAcountWishInfo,
    GenshinApiResponseWish,
} from "../../../types/types";

const fs: typeof import("fs").promises = require("fs").promises;

type WishImporterResult = {
    character: {
        pullCount: number;
        last4Star: WishRelationship | null;
        last5Star: WishRelationship | null;
        pity4Star: number;
        pity5Star: number;
        lastId: string;
    };
    weapon: {
        pullCount: number;
        last4Star: WishRelationship | null;
        last5Star: WishRelationship | null;
        pity4Star: number;
        pity5Star: number;
        lastId: string;
    };
    standard: {
        pullCount: number;
        last4Star: WishRelationship | null;
        last5Star: WishRelationship | null;
        pity4Star: number;
        pity5Star: number;
        lastId: string;
    };
};

type WishRelationship = {
    relationshipTo: "genshin-characters" | "genshin-weapons";
    value: "string";
};

export const wishImporter = async (
    authedLink: string,
    accountId: string,
    wishInfo: GenshinAcountWishInfo
): Promise<WishImporterResult | null> => {
    const history = {};

    for (let i = 0; i < Object.keys(WISH_HISTORY).length; i++) {
        const originalUrl = new URL(authedLink);
        const searchParams = originalUrl.searchParams;

        const newUrl = new URL(HOYO_WISH_API_URL);
        newUrl.search = searchParams.toString();

        const key = Object.keys(WISH_HISTORY)[i];
        const wishes = await getHistory(
            newUrl,
            WISH_BANNER_CODES[key],
            wishInfo.character.lastId
        );
        if (!wishes) {
            console.log(
                "error getting history",
                key,
                WISH_BANNER_CODES[key],
                wishes
            );
            history["error"] = true;
            break;
        }

        const bannerType = WISH_HISTORY[key];
        let pity4Star = wishInfo[bannerType].pity4Star || 0;
        let pity5Star = wishInfo[bannerType].pity5Star || 0;
        let last4Star = wishInfo[bannerType].last4Star;
        let last5Star = wishInfo[bannerType].last5Star;

        for (let i = wishes.length - 1; i >= 0; i--) {
            const el = wishes[i];
            pity4Star++;
            pity5Star++;
            let pity = 1;
            if (el.rarity === 4) {
                pity = pity4Star;
                pity4Star = 0;
                last4Star = el.itemId;
            } else if (el.rarity === 5) {
                pity = pity5Star;
                pity5Star = 0;
                last5Star = el.itemId;
            }
            wishes[i] = {
                ...el,
                pity,
                genshinAccount: accountId,
                bannerType,
                id: `${accountId}-${bannerType}-${i}`,
            };
        }

        wishInfo[bannerType].pullCount =
            wishInfo[bannerType].pullCount + wishes.length;
        wishInfo[bannerType].lastId = wishes[0]?.hoyoId || "";
        wishInfo[bannerType].last4Star = last4Star;
        wishInfo[bannerType].last5Star = last5Star;
        wishInfo[bannerType].pity4Star = pity4Star;
        wishInfo[bannerType].pity5Star = pity5Star;

        history[bannerType] = {
            // pullCount: wishInfo[bannerType].pullCount + wishes.length,
            wishes,
            // last4Star,
            // last5Star,
            // pity4Star,
            // pity5Star,
            // lastId: wishes[0]?.hoyoId || "",
        };
    }
    if (history["error"]) {
        console.error("THERE WAS AN ERROR WHILE FETCHING HISTORY");
        return null;
    }

    return history as WishImporterResult;
};

// push to wishes, if lastId saved in DB is encountered, stop pushing, return true => should stop fetching wishes
// null = no lastId in db
const pushToWishHistory = (
    wishes: any[],
    newWishes: any[],
    lastId: string | null
) => {
    for (let i = 0; i < newWishes.length; i++) {
        const wish: GenshinApiResponseWish = newWishes[i];
        if (lastId && lastId === wish.id) {
            return true;
        }
        const item = {
            relationshipTo:
                wish.item_type === "Character"
                    ? "genshin-characters"
                    : "genshin-weapons",
            value: normalizeName(wish.name),
        };

        const newWish = {
            date: wish.time,
            itemId: item,
            rarity: Number.parseInt(wish.rank_type),
            hoyoId: wish.id,
        };
        wishes.push(newWish);
    }
    return false;
};

const getHistory = async (
    url: URL,
    bannerCode: WISH_BANNER_CODES,
    lastId: string | null
) => {
    url.searchParams.set("gacha_type", String(bannerCode));
    url.searchParams.set("size", "20");
    try {
        // initial request
        const wishes = [];
        const req = await axios.get(url.href);
        const result = req.data;
        // docs should be null
        if (!result.data || result.retcode === -101) {
            throw new Error("Invalid link provided");
        }
        if (pushToWishHistory(wishes, result.data.list, lastId)) {
            // if lastId is found, stop fetching, return wishes
            return wishes;
        }
        // use this as the end_id
        let endId = wishes[wishes.length - 1]?.hoyoId;
        while (endId) {
            // sleep for 1 second to avoid timeout
            await sleep(1000);
            console.log("running with end_id=", endId);
            url.searchParams.set("end_id", endId);
            const req = await axios.get(url.href);
            const result = req.data;
            if (!result.data || result.retcode === -101) {
                throw new Error("Invalid link provided");
            }
            const resultData = result.data.list;
            if (pushToWishHistory(wishes, resultData, lastId)) {
                break;
            }
            endId =
                resultData.length === 0
                    ? ""
                    : wishes[wishes.length - 1]?.hoyoId;
        }
        return wishes;
    } catch (error) {
        console.error("error", error);
        return null;
    }
};
