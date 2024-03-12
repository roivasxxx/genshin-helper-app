// icons are not needed so no need to create a collection
export const GENSHIN_SUBSTATS = [
    { label: "ATK %", value: "atk" },
    { label: "HP %", value: "hp" },
    { label: "Def %", value: "def" },
    { label: "Elemental Mastery", value: "em" },
    { label: "Elemental Recharge", value: "er" },
    { label: "Crit %", value: "critRate" },
    { label: "Crit DMG %", value: "critDmg" },
    { label: "Physical DMG %", value: "physicalDmg" },
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
