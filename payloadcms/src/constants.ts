import { GenshinAcountWishInfo } from "../types/types";

// icons are not needed so no need to create a collection
export const GENSHIN_SUBSTATS = [
    { label: "ATK%", value: "TK%" },
    { label: "HP%", value: "HP%" },
    { label: "DEF%", value: "DEF%" },
    { label: "Elemental Mastery", value: "Elemental Mastery" },
    { label: "Energy Recharge", value: "Energy Recharge" },
    { label: "CRIT Rate", value: "CRIT Rate" },
    { label: "CRIT DMG", value: "CRIT DMG" },
    { label: "Physical DMG Bonus", value: "Physical DMG Bonus" },
];

// icons are not needed so no need to create a collection
export const GENSHIN_REGIONS = [
    { label: "Mondstadt", value: "mondstadt" },
    { label: "Liyue", value: "liyue" },
    { label: "Inazuma", value: "inazuma" },
    { label: "Sumeru", value: "sumeru" },
    { label: "Fontaine", value: "fontaine" },
];

// returns options from start to end
export const RARITY_LABELS = (start: number, end: number) => {
    return new Array(end - start + 1).fill(0).map((_, i) => ({
        label: String(start + i),
        value: String(start + i),
    }));
};

export enum ALLOWED_EVENT_NOTIFICATIONS {
    DOMAINS = "domains",
    EVENTS = "events",
}

export enum WISH_HISTORY {
    WEAPON = "weapon",
    STANDARD = "standard",
    CHARACTER = "character",
}

// used for fetching data from hoyo wish history
export enum WISH_BANNER_CODES {
    STANDARD = 200,
    CHARACTER = 301,
    WEAPON = 302,
}
export enum WISH_REGIONS {
    EUROPE = "os_euro",
    ASIA = "os_asia",
    AMERICA = "os_usa",
    CHINA = "os_cht",
}

export const HOYO_WISH_API_URL =
    "https://hk4e-api-os.hoyoverse.com/event/gacha_info/api/getGachaLog";
export enum DAYS {
    MONDAY = "monday",
    TUESDAY = "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday",
    SATURDAY = "saturday",
    SUNDAY = "sunday",
}

export const DEFAULT_GENSHIN_WISH_INFO: GenshinAcountWishInfo = {
    standard: {
        pullCount: 0,
        last4Star: "",
        last5Star: "",
        pity4Star: 0,
        pity5Star: 0,
        lastId: null,
    },
    weapon: {
        pullCount: 0,
        last4Star: "",
        last5Star: "",
        pity4Star: 0,
        pity5Star: 0,
        lastId: null,
    },
    character: {
        pullCount: 0,
        last4Star: "",
        last5Star: "",
        pity4Star: 0,
        pity5Star: 0,
        lastId: null,
    },
};
