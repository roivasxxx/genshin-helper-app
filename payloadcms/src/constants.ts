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
    return new Array(end - start + 1)
        .fill(0)
        .map((i) => ({ label: String(start + i), value: String(start + i) }));
};
