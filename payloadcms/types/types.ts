import { GenshinAccount } from "./payload-types";

export type GenshinAcountWishInfo = {
    character: GenshinAccount["wishInfo"]["character"];
    weapon: GenshinAccount["wishInfo"]["weapon"];
    standard: GenshinAccount["wishInfo"]["standard"];
};

export type GenshinApiResponseWish = {
    uid: string;
    gacha_type: string;
    item_id: string;
    count: string;
    time: string;
    name: string;
    lang: string;
    item_type: "Weapon" | "Character";
    rank_type: string;
    id: string;
    pity: number;
};
