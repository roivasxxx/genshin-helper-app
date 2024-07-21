import { Response } from "express";
import payload from "payload";
import { WISH_HISTORY } from "../../constants";
import { GenshinWish } from "../../../types/payload-types";
import * as ExcelJS from "exceljs";
export default async function exportWishHistory(
    accountId: string,
    res: Response,
    fileType: "xlsx" | "json"
) {
    if (fileType === "json") {
        res.write("{");

        res.write(`"${WISH_HISTORY.STANDARD}":[`);
        await writeBannerToJSON(accountId, WISH_HISTORY.STANDARD, res);
        res.write("],");
        res.write(`"${WISH_HISTORY.CHARACTER}":[`);
        await writeBannerToJSON(accountId, WISH_HISTORY.CHARACTER, res);
        res.write("],");
        res.write(`"${WISH_HISTORY.WEAPON}":[`);
        await writeBannerToJSON(accountId, WISH_HISTORY.WEAPON, res);
        res.write("]");
        res.write("}");
        res.end();
    } else {
        const workBook = new ExcelJS.stream.xlsx.WorkbookWriter({
            stream: res,
        });

        const standard = await getBannerData(accountId, WISH_HISTORY.STANDARD);
        const character = await getBannerData(
            accountId,
            WISH_HISTORY.CHARACTER
        );
        const weapon = await getBannerData(accountId, WISH_HISTORY.WEAPON);
        writeSheet(WISH_HISTORY.STANDARD, standard, workBook);
        writeSheet(WISH_HISTORY.CHARACTER, character, workBook);
        writeSheet(WISH_HISTORY.WEAPON, weapon, workBook);
        await workBook.commit();
    }
}

const writeSheet = (
    banner: WISH_HISTORY,
    data: GenshinWish[],
    workBook: ExcelJS.stream.xlsx.WorkbookWriter
) => {
    const worksheet = workBook.addWorksheet(banner);
    worksheet.columns = [
        { header: "Wish Number", key: "wishNumber" },
        { header: "Hoyo Id", key: "id" },
        { header: "Date", key: "date" },
        { header: "Banner Type", key: "bannerType" },
        { header: "Item Id", key: "itemId" },
        { header: "Item", key: "item" },
        { header: "Item Type", key: "itemType" },
        { header: "Rarity", key: "rarity" },
        { header: "Pity", key: "pity" },
    ];
    data.map(getWishData).forEach((wish) => {
        worksheet.addRow(wish).commit();
    });
    worksheet.commit();
};

const getBannerData = async (accountId: string, banner: WISH_HISTORY) => {
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
            pagination: false,
            sort: "-wishNumber",
        });
        return wishesReq.docs;
    } catch (error) {
        console.error("getBannerData threw an error: ", error);
        return [];
    }
};

const writeBannerToJSON = async (
    accountId: string,
    banner: WISH_HISTORY,
    res: Response
) => {
    try {
        const data = await getBannerData(accountId, banner);
        const length = data.length;
        data.forEach((wish, index) => {
            res.write(
                JSON.stringify(getWishData(wish)) +
                    (index < length - 1 ? "," : "")
            );
        });
    } catch (error) {
        console.error("writeBanner threw an error: ", error);
    }
};

const getWishData = (wish: GenshinWish) => {
    const value = wish.itemId.value;
    if (typeof value === "object" && "name" in value && "id" in value) {
        {
            return {
                date: wish.date,
                item: value.name,
                itemId: value.id,
                itemType:
                    wish.itemId.relationTo === "genshin-characters"
                        ? "character"
                        : "weapon",
                rarity: wish.rarity,
                id: wish.hoyoId,
                bannerType: wish.bannerType,
                pity: wish.pity,
                wishNumber: wish.wishNumber,
            };
        }
    }
};
