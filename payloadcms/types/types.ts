import { WISH_REGIONS } from "../src/constants";
import { GenshinAccount, Media } from "./payload-types";

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

export type NotificationConfig = {
    region: WISH_REGIONS;
    startDate: string;
    timezone: string;
};

export type RecordToMap = Record<string, any> & {
    name: string;
    id: string;
    icon: string | Media;
};

export type SimpleRecord = {
    name: string;
    id: string;
};

export type RecordWithIcon = SimpleRecord & {
    icon: string;
};
