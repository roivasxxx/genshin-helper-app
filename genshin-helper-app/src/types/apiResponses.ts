export type NameIconDictionary = {
    name: string;
    icon?: string;
};

export type GenshinCharactersResponse = {
    id: string;
    name: string;
    icon: string;
    substat: string;
    weaponType: string;
    rarity: number;
    element: NameIconDictionary & { id: string };
    specialty: NameIconDictionary;
    talent: NameIconDictionary;
    trounce: NameIconDictionary;
    boss?: NameIconDictionary;
    gem: NameIconDictionary;
    books: NameIconDictionary[];
};

export type GenshinElementsResponse = NameIconDictionary & { id: string };
