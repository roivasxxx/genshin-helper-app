type GameInfo = {
    path: string;
    label: string;
};

export enum GAMES {
    GENSHIN = "genshin-impact",
    STAR_RAIL = "honkai-star-rail",
    ZENLESS = "zenless-zone-zero",
}

export const GAME_INFO: Record<GAMES, GameInfo> = {
    [GAMES.GENSHIN]: {
        path: "genshin-impact",
        label: "Genshin Impact",
    },
    [GAMES.STAR_RAIL]: {
        path: "honkai-star-rail",
        label: "Honkai Star Rail",
    },
    [GAMES.ZENLESS]: {
        path: "zenless-zone-zero",
        label: "Zenless Zone Zero",
    },
};

export const DEFAULT_GAME = GAMES.GENSHIN;

export enum GENSHIN_WEAPONS {
    SWORD = "sword",
    CLAYMORE = "claymore",
    POLEARM = "polearm",
    BOW = "bow",
    CATALYST = "catalyst",
}

export const STAR_SYMBOL = "\u2605";
