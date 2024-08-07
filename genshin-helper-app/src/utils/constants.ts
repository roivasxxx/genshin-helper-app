import {
    ARTICLE_STATUS,
    FIFTY_FIFTY_STATUS,
    GENSHIN_ARTICLE_TYPE,
    GENSHIN_MATERIAL_TYPE,
    GENSHIN_SUBSTAT,
} from "@/types/genshinTypes";

type GameInfo = {
    path: string;
    label: string;
};

export enum GAMES {
    GENSHIN = "genshin-impact",
    // STAR_RAIL = "honkai-star-rail",
    // ZENLESS = "zenless-zone-zero",
}

export enum GENSHIN_ACCOUNT_REGIONS {
    "os_euro" = "Europe",
    "os_asia" = "Asia",
    "os_usa" = "America",
    "os_cht" = "China",
}

export enum GAME_ACCOUNT_ID {
    GENSHIN = "genshin",
    // ...
}

export const GAME_ACCOUNTS_IDS = [GAME_ACCOUNT_ID.GENSHIN];

export const GAME_INFO: Record<GAMES, GameInfo> = {
    [GAMES.GENSHIN]: {
        path: "genshin-impact",
        label: "Genshin Impact",
    },
    // [GAMES.STAR_RAIL]: {
    //     path: "honkai-star-rail",
    //     label: "Honkai Star Rail",
    // },
    // [GAMES.ZENLESS]: {
    //     path: "zenless-zone-zero",
    //     label: "Zenless Zone Zero",
    // },
};

export const DEFAULT_GAME = GAMES.GENSHIN;

export enum GENSHIN_WEAPON {
    SWORD = "sword",
    CLAYMORE = "claymore",
    POLEARM = "polearm",
    BOW = "bow",
    CATALYST = "catalyst",
}

export const STAR_SYMBOL = "\u2605";
export const STEP_SYMBOL = "\u2514";

export const PRIMOS_PER_WISH = 160;

export enum BANNER_TYPE {
    CHARACTER = "character",
    WEAPON = "weapon",
    STANDARD = "standard",
}

export enum GACHA_TYPE {
    WEAPON = "302",
    STANDARD = "200",
    CHARACTER = "301",
    CHARACTER_2 = "400",
}

export const FIFTY_FIFTY_TEXT_SHORT = {
    [FIFTY_FIFTY_STATUS.NONE]: "",
    [FIFTY_FIFTY_STATUS.WON]: "W",
    [FIFTY_FIFTY_STATUS.LOST]: "L",
    [FIFTY_FIFTY_STATUS.GUARANTEED]: "G",
};
export const FIFTY_FIFTY_TEXT_LONG = {
    [FIFTY_FIFTY_STATUS.NONE]: "",
    [FIFTY_FIFTY_STATUS.WON]: "Won 50/50",
    [FIFTY_FIFTY_STATUS.LOST]: "Lost 50/50",
    [FIFTY_FIFTY_STATUS.GUARANTEED]: "Guaranteed 50/50",
};

export const GENSHIN_MATERIAL_TEXT = {
    [GENSHIN_MATERIAL_TYPE.WEAPON_MAT]: "Weapon Materials",
    [GENSHIN_MATERIAL_TYPE.BOOK]: "Books",
    [GENSHIN_MATERIAL_TYPE.MOB_DROP]: "Mob Drops",
    [GENSHIN_MATERIAL_TYPE.BOSS_DROP]: "Boss Drops",
    [GENSHIN_MATERIAL_TYPE.TROUNCE_DROP]: "Weekly Boss Drops",
    [GENSHIN_MATERIAL_TYPE.GEM]: "Gems",
    [GENSHIN_MATERIAL_TYPE.SPECIALTY]: "Regional Specialties",
};

export const GENSHIN_SUBSTAT_TEXT = {
    [GENSHIN_SUBSTAT.GEO_DMG]: "Geo Damage Bonus",
    [GENSHIN_SUBSTAT.DENDRO_DMG]: "Dendro DMG Bonus",
    [GENSHIN_SUBSTAT.CRYO_DMG]: "Cryo DMG Bonus",
    [GENSHIN_SUBSTAT.ATK]: "Atk %",
    [GENSHIN_SUBSTAT.CRIT_RATE]: "Crit Rate",
    [GENSHIN_SUBSTAT.HP]: "HP %",
    [GENSHIN_SUBSTAT.ELECTRO_DMG]: "Electro DMG Bonus",
    [GENSHIN_SUBSTAT.ENERGY_RECHARGE]: "Energy Recharge",
    [GENSHIN_SUBSTAT.HYDRO_DMG]: "Hydro DMG Bonus",
    [GENSHIN_SUBSTAT.CRIT_DMG]: "Crit Damage",
    [GENSHIN_SUBSTAT.HEALING_BONUS]: "Healing Bonus",
    [GENSHIN_SUBSTAT.ELEMENTAL_MASTERY]: "Elemental Mastery",
    [GENSHIN_SUBSTAT.PYRO_DMG]: "Pyro DMG Bonus",
    [GENSHIN_SUBSTAT.ANEMO_DMG]: "Anemo DMG Bonus",
    [GENSHIN_SUBSTAT.DEF]: "Def %",
    [GENSHIN_SUBSTAT.PHYSICAL_DMG]: "Physical DMG Bonus",
};

export const GENSHIN_BANNER_NAME = {
    [BANNER_TYPE.CHARACTER]: "Character",
    [BANNER_TYPE.WEAPON]: "Weapon",
    [BANNER_TYPE.STANDARD]: "Standard",
};

export const ARTICLE_KEY_VALUES = {
    element: {
        electro: {
            text: "electro",
            className: "text-electro-elements-electro",
        },
        pyro: {
            text: "pyro",
            className: "text-electro-elements-pyro",
        },
        hydro: {
            text: "hydro",
            className: "text-electro-elements-hydro",
        },
        cryo: {
            text: "cryo",
            className: "text-electro-elements-cryo",
        },
        dendro: {
            text: "dendro",
            className: "text-electro-elements-dendro",
        },
        anemo: {
            text: "anemo",
            className: "text-electro-elements-anemo",
        },
        geo: {
            text: "geo",
            className: "text-electro-elements-geo",
        },
    },
    reaction: {
        aggravate: {
            text: "aggravate",
        },
    },
    rarity: {
        "4": {
            text: `4 ${STAR_SYMBOL}`,
        },
        "5": {
            text: `5 ${STAR_SYMBOL}`,
        },
    },
    articleType: {
        [GENSHIN_ARTICLE_TYPE.GUIDE]: {
            text: "Guide",
        },
    },
    articleStatus: {
        [ARTICLE_STATUS.NEW]: {
            text: "New",
        },
        [ARTICLE_STATUS.UPDATED]: {
            text: "Updated",
        },
    },
};
