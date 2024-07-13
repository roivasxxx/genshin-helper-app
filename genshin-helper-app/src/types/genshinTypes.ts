import { BANNER_TYPE, GACHA_TYPE } from "@/utils/constants";

export type NameIconDictionary = {
    name: string;
    icon?: string;
};

export type NameIconWithIdDictionary = NameIconDictionary & { id: string };

export type NameIconWithDescriptionDictionary = NameIconDictionary & {
    description: string;
};

export type GenshinCharacter = {
    id: string;
    name: string;
    icon: string;
    substat: GENSHIN_SUBSTAT;
    weaponType: string;
    rarity: number;
    element: NameIconDictionary & { id: string };
    specialty: NameIconDictionary;
    talent: NameIconDictionary;
    trounce: NameIconDictionary;
    boss?: NameIconDictionary;
    gem: NameIconDictionary;
    books: NameIconDictionary[];
    birthday: string;
};

export type ExtraGenshinCharacter = GenshinCharacter & {
    splash?: string;
    events: {
        id: string;
        start: string;
        end: string;
        version: string;
        timezoneDependent: boolean;
        characters: {
            fiveStar: NameIconWithIdDictionary[];
            fourStar: NameIconWithIdDictionary[];
            // first banner
            fiveStar1: NameIconWithIdDictionary;
            // second banner - old banners might only have one 5* character
            fiveStar2: NameIconWithIdDictionary | null;
        };
    }[];
    constellations: {
        c1: NameIconWithDescriptionDictionary;
        c2: NameIconWithDescriptionDictionary;
        c3: NameIconWithDescriptionDictionary;
        c4: NameIconWithDescriptionDictionary;
        c5: NameIconWithDescriptionDictionary;
        c6: NameIconWithDescriptionDictionary;
    };
    skills: {
        combat1: NameIconWithDescriptionDictionary;
        combat2: NameIconWithDescriptionDictionary;
        combat3: NameIconWithDescriptionDictionary;
        combatsp?: NameIconWithDescriptionDictionary;
        passive1: NameIconWithDescriptionDictionary;
        passive2: NameIconWithDescriptionDictionary;
        passive3?: NameIconWithDescriptionDictionary;
    };
};

export type GenshinElementsResponse = NameIconDictionary & { id: string };

export enum GENSHIN_SUBSTAT {
    GEO_DMG = "geo_dmg_bonus",
    DENDRO_DMG = "dendro_dmg_bonus",
    CRYO_DMG = "cryo_dmg_bonus",
    ATK = "atk",
    CRIT_RATE = "crit_rate",
    HP = "hp%",
    ELECTRO_DMG = "electro_dmg_bonus",
    ENERGY_RECHARGE = "energy_recharge",
    HYDRO_DMG = "hydro_dmg_bonus",
    CRIT_DMG = "crit_damage",
    HEALING_BONUS = "healing_bonus",
    ELEMENTAL_MASTERY = "elemental_mastery",
    PYRO_DMG = "pyro_dmg_bonus",
    ANEMO_DMG = "anemo_dmg_bonus",
    DEF = "def",
    PHYSICAL_DMG = "physical_dmg_bonus",
}

export enum GenshinWeaponTypes {
    SWORD = "sword",
    CATALYST = "catalyst",
    CLAYMORE = "claymore",
    POLEARM = "polearm",
    BOW = "bow",
}

export type GenshinWeapon = NameIconWithIdDictionary & {
    rarity: number;
    weaponType: keyof typeof GenshinWeaponTypes;
    substat: GENSHIN_SUBSTAT;
    version: string;
    stats: {
        primary: {
            value: number;
        };
        secondary: {
            value: number;
            stat: GENSHIN_SUBSTAT;
        };
    };
    refinements: {
        text: string;
        name: string;
        values: string[][];
    };
    domain: NameIconWithIdDictionary[];
    mobDrops: {
        first: NameIconWithIdDictionary[];
        second: NameIconWithIdDictionary[];
    };
};

export type GenshinArtifact = NameIconWithIdDictionary & {
    rarity: number[];
    setPiece: number[];
    bonuses: string[];
    domains: {
        id: string;
        name: string;
    }[];
};

export enum GENSHIN_MATERIAL_TYPE {
    WEAPON_MAT = "weaponMat",
    BOOK = "book",
    MOB_DROP = "mobDrop",
    BOSS_DROP = "bossDrop",
    TROUNCE_DROP = "trounceDrop",
    GEM = "gem",
    SPECIALTY = "specialty",
}

export type GenshinMaterialBase = {
    id: string;
    value: (NameIconWithIdDictionary & { rarity: number })[];
};

export type GenshinGenericItem = GenshinMaterialBase & {
    type: "gem" | "specialty";
};

export type GenshinDomainMaterial = GenshinMaterialBase & {
    type: Exclude<
        GENSHIN_MATERIAL_TYPE,
        GENSHIN_MATERIAL_TYPE.GEM | GENSHIN_MATERIAL_TYPE.SPECIALTY
    >;
    domain: NameIconWithIdDictionary;
};

export type GenshinDayDependentMaterial = GenshinDomainMaterial & {
    type: GENSHIN_MATERIAL_TYPE.BOOK | GENSHIN_MATERIAL_TYPE.WEAPON_MAT;
    days: string[];
    domain: { name: string; id: string };
};

export type GenshinMaterial =
    | GenshinGenericItem
    | GenshinDomainMaterial
    | GenshinDayDependentMaterial;

type GenshinBaseEvent = {
    end: string;
    start: string;
    timezoneDependent: boolean;
    url?: string;
    name: string;
};

export type GenshinGameEvent = GenshinBaseEvent & {
    type: "event";
    icon?: string;
};

export type GenshinCharacterBanner = GenshinBaseEvent & {
    type: "banner";
    bannerType: "character";
    characters: {
        fiveStar1: NameIconWithIdDictionary;
        fiveStar2?: NameIconWithIdDictionary;
        fourStar: NameIconWithIdDictionary[];
    };
};

export type GenshinWeaponBanner = GenshinBaseEvent & {
    type: "banner";
    bannerType: "weapon";
    weapons: {
        fiveStar1: NameIconWithIdDictionary;
        fiveStar2?: NameIconWithIdDictionary;
        fourStar: NameIconWithIdDictionary[];
    };
};

export type GenshinEvent =
    | GenshinGameEvent
    | GenshinCharacterBanner
    | GenshinWeaponBanner;

export type GenshinBanner = GenshinCharacterBanner | GenshinWeaponBanner;

export type NotificationItemType = {
    name: string;
    id: string;
    icon?: string;
    days: string[];
};

export enum IMPORT_STATUS {
    "NONE" = "None",
    "NEW" = "In queue",
    "IN_PROGRESS" = "In progress",
    "COMPLETED" = "Completed",
    "FAILED" = "Failed",
    "CANCELLED" = "Cancelled",
}

export interface GenshinAccount {
    wishInfo: WishInfo;
    region: string;
    accountId: string;
    importJobStatus: keyof typeof IMPORT_STATUS;
}
export interface WishInfo {
    standard: BannerInfo;
    character: BannerInfo;
    weapon: BannerInfo;
    lastUpdate?: string;
}
export interface BannerInfo {
    pullCount: number;
    last4Star: string | null;
    last5Star: string | null;
    pity4Star: number;
    pity5Star: number;
    lastId: string | null;
}

export interface BaseWish {
    id: string;
    date: string;
    rarity: number;
    hoyoId: string;
    pity: number;
    wishNumber: number;
    gachaType: GACHA_TYPE;
    item: {
        value: string;
        icon?: {
            alt: string;
            originalName: string;
            url: string;
        };
    };
    banner: string;
}

export enum FIFTY_FIFTY_STATUS {
    "NONE" = "none",
    "WON" = "won",
    "LOST" = "lost",
    "GUARANTEED" = "guaranteed",
}
export type StandardWish = BaseWish & {
    type: BANNER_TYPE.STANDARD;
    fiftyFiftyStatus: FIFTY_FIFTY_STATUS.NONE;
};

export type CharacterBanner = BaseWish & {
    type: BANNER_TYPE.CHARACTER;
    fiftyFiftyStatus: FIFTY_FIFTY_STATUS;
};
export type WeaponBanner = BaseWish & {
    type: BANNER_TYPE.WEAPON;
    fiftyFiftyStatus: FIFTY_FIFTY_STATUS;
};

export type Wish = StandardWish | CharacterBanner | WeaponBanner;
