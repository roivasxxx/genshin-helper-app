import { STAR_SYMBOL } from "./constants";

export const capitalizeString = (str: string) => {
    const split = str.split(/\s+/);
    return split
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const getStarString = (rarity: number) => {
    let _rarity = Number(rarity);
    if (!rarity || Number.isNaN(_rarity)) {
        _rarity = 5;
    }
    return STAR_SYMBOL.repeat(_rarity);
};
