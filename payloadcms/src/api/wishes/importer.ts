import axios from "axios";
import { HOYO_WISH_API_URL, WISH_BANNER_CODES } from "../../constants";
import { sleep } from "../../utils";
const fs: typeof import("fs").promises = require("fs").promises;
export const wishImporter = async (
    authedLink: string,
    lastIds: {
        character: string | null;
        weapon: string | null;
        standard: string | null;
    }
) => {
    const originalUrl = new URL(authedLink);
    const searchParams = originalUrl.searchParams;
    searchParams.set("gacha_type", "301");
    const newUrl = new URL(HOYO_WISH_API_URL);
    newUrl.search = searchParams.toString();

    // Resulting URL
    console.log(newUrl.href);
    const history = await getHistory(
        newUrl,
        WISH_BANNER_CODES.CHARACTER,
        lastIds.character
    );
    console.log(history.length);
    // await fs.writeFile("history.json", JSON.stringify({ history }));
};

// push to wishes, if lastId saved in DB is encountered, stop pushing, return true => should stop fetching wishes
// null = no lastId in db
const pushToWishHistory = (
    wishes: any[],
    newWishes: any[],
    lastId: string | null
) => {
    for (let i = 0; i < newWishes.length; i++) {
        if (lastId && lastId === newWishes[i].id) {
            return true;
        }
        wishes.push(newWishes[i]);
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
        let endId = wishes[wishes.length - 1]?.id;
        console.log(endId);
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
                resultData.length === 0 ? "" : wishes[wishes.length - 1]?.id;
        }
        return wishes;
    } catch (error) {}
};
