export type NameIconDictionary = {
    name: string;
    icon?: string;
};

export type NameIconWithIdDictionary = NameIconDictionary & { id: string };

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
