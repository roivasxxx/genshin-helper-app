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
    substat: keyof typeof GenshinCharacterSubstats;
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

export enum GenshinCharacterSubstats {
    geo_dmg_bonus = "Geo Damage Bonus",
    dendro_dmg_bonus = "Dendro DMG Bonus",
    cryo_dmg_bonus = "Cryo DMG Bonus",
    atk = "Atk %",
    crit_rate = "Crit Rate",
    hp = "HP %",
    electro_dmg_bonus = "Electro DMG Bonus",
    energy_recharge = "Energy Recharge",
    hydro_dmg_bonus = "Hydro DMG Bonus",
    crit_dmg = "Crit Damage",
    healing_bonus = "Healing Bonus",
    elemental_mastery = "Elemental Mastery",
    pyro_dmg_bonus = "Pyro DMG Bonus",
    anemo_dmg_bonus = "Anemo DMG Bonus",
    def = "Def %",
    physical_dmg_bonus = "Physical DMG Bonus",
}

export enum GenshinWeaponTypes {
    sword = "Sword",
    catalyst = "Catalyst",
    claymore = "Claymore",
    polearm = "Polearm",
    bow = "Bow",
}

export type GenshinWeapon = NameIconWithIdDictionary & {
    rarity: number;
    weaponType: keyof typeof GenshinWeaponTypes;
    substat: keyof typeof GenshinCharacterSubstats;
    version: string;
    stats: {
        primary: {
            value: number;
        };
        secondary: {
            value: number;
            stat: keyof typeof GenshinCharacterSubstats;
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

export type GenshinMaterialType =
    | "weaponMat"
    | "book"
    | "mobDrop"
    | "bossDrop"
    | "trounceDrop"
    | "gem"
    | "specialty";

export enum GenshinMaterialLabel {
    weaponMat = "Weapon Materials",
    book = "Books",
    mobDrop = "Mob Drops",
    bossDrop = "Boss Drops",
    trounceDrop = "Weekly Boss Drops",
    gem = "Gems",
    specialty = "Regional Specialties",
}

export type GenshinMaterialBase = {
    id: string;
    value: (NameIconWithIdDictionary & { rarity: number })[];
};

export type GenshinGenericItem = GenshinMaterialBase & {
    type: "gem" | "specialty";
};

export type GenshinDomainMaterial = GenshinMaterialBase & {
    type: Exclude<GenshinMaterialType, "gem" | "specialty">;
    domain: NameIconWithIdDictionary;
};

export type GenshinDayDependentMaterial = GenshinDomainMaterial & {
    type: "book" | "weaponMat";
    days: string[];
    domain: { name: string; id: string };
};

export type GenshinMaterial =
    | GenshinGenericItem
    | GenshinDomainMaterial
    | GenshinDayDependentMaterial;
