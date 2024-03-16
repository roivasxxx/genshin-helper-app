import axios from "axios";
import { HOYO_WISH_API_URL, WISH_BANNER_CODES } from "../../constants";
import { sleep } from "../../utils";
const fs: typeof import("fs").promises = require("fs").promises;
export const wishImporter = async (authedLink: string) => {
    const originalUrl = new URL(authedLink);
    const searchParams = originalUrl.searchParams;
    searchParams.set("gacha_type", "301");
    const newUrl = new URL(HOYO_WISH_API_URL);
    newUrl.search = searchParams.toString();

    // Resulting URL
    console.log(newUrl.href);
    const history = await getHistory(newUrl, WISH_BANNER_CODES.CHARACTER);
    console.log(history.length);
    await fs.writeFile("history.json", JSON.stringify({ history }));
};

const getHistory = async (url: URL, bannerCode: WISH_BANNER_CODES) => {
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
        wishes.push(...result.data.list);
        console.log(wishes.length);
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
            wishes.push(...result.data.list);
            endId =
                resultData.length === 0 ? "" : wishes[wishes.length - 1]?.id;
        }
        return wishes;
    } catch (error) {}
};
