import { GenshinAcountWishInfo } from "../types/types";

// icons are not needed so no need to create a collection
export const GENSHIN_SUBSTATS = [
    { label: "ATK%", value: "atk" },
    { label: "HP%", value: "hp" },
    { label: "DEF%", value: "def" },
    { label: "Elemental Mastery", value: "elemental_mastery" },
    { label: "Energy Recharge", value: "energy_recharge" },
    { label: "CRIT Rate", value: "crit_rate" },
    { label: "CRIT DMG", value: "crit_dmg" },
    { label: "Physical DMG Bonus", value: "physical_dmg_bonus" },
];

// icons are not needed so no need to create a collection
export const GENSHIN_REGIONS = [
    { label: "Mondstadt", value: "Mondstadt" },
    { label: "Liyue", value: "Liyue" },
    { label: "Inazuma", value: "Inazuma" },
    { label: "Sumeru", value: "Sumeru" },
    { label: "Fontaine", value: "Fontaine" },
    { label: "Natlan", value: "Natlan" },
    { label: "Snezhnaya", value: "Snezhnaya" },
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
    WEAPON = 302,
    STANDARD = 200,
    CHARACTER = 301,
    CHARACTER_2 = 400,
}

export enum WISH_REGIONS {
    EUROPE = "os_euro",
    ASIA = "os_asia",
    AMERICA = "os_usa",
    CHINA = "os_cht",
}

export const WISH_REGION_TIMEZONES = {
    [WISH_REGIONS.EUROPE]: 1,
    [WISH_REGIONS.ASIA]: 8,
    [WISH_REGIONS.AMERICA]: -5,
    [WISH_REGIONS.CHINA]: 8,
};

export const getWishApiUrl = (region: WISH_REGIONS) => {
    return region === WISH_REGIONS.AMERICA || region === WISH_REGIONS.EUROPE
        ? "https://hk4e-api-os.hoyoverse.com/gacha_info/api/getGachaLog"
        : "https://public-operation-hk4e.mihoyo.com/gacha_info/api/getGachaLog";
};

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
        last4Star: null,
        last5Star: null,
        pity4Star: 0,
        pity5Star: 0,
        lastId: null,
        guaranteed5Star: false,
    },
    weapon: {
        pullCount: 0,
        last4Star: null,
        last5Star: null,
        pity4Star: 0,
        pity5Star: 0,
        lastId: null,
        guaranteed5Star: false,
    },
    character: {
        pullCount: 0,
        last4Star: null,
        last5Star: null,
        pity4Star: 0,
        pity5Star: 0,
        lastId: null,
        guaranteed5Star: false,
    },
};

export const EXPO_NOTIFICATION_API = "https://exp.host/--/api/v2/push/send";
