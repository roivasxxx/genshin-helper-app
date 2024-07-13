import {
    FIFTY_FIFTY_STATUS,
    GenshinCharacterBanner,
    GenshinEvent,
    GenshinWeaponBanner,
} from "@/types/genshinTypes";
import { STAR_SYMBOL } from "./constants";

export const createDeepCopy = (obj: object) => JSON.parse(JSON.stringify(obj));

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

export const isEvent = (event: GenshinEvent): event is GenshinEvent => {
    return event.type === "event";
};

export const isCharacterBanner = (
    event: GenshinEvent
): event is GenshinCharacterBanner => {
    return event.type === "banner" && event.bannerType === "character";
};

export const isWeaponBanner = (
    event: GenshinEvent
): event is GenshinWeaponBanner => {
    return event.type === "banner" && event.bannerType === "weapon";
};

export const isNumber = (value?: string | number) => {
    return value != null && value !== "" && !isNaN(Number(value.toString()));
};

export const getFiftyFiftyColor = (status: FIFTY_FIFTY_STATUS) => {
    let fiftyFiftyStatusColor = "text-sky-300";

    switch (status) {
        case FIFTY_FIFTY_STATUS.GUARANTEED:
            fiftyFiftyStatusColor = "text-electro-5star-from";
            break;
        case FIFTY_FIFTY_STATUS.WON:
            fiftyFiftyStatusColor = "text-green-500";
            break;
        case FIFTY_FIFTY_STATUS.LOST:
            fiftyFiftyStatusColor = "text-red-500";
            break;
    }
    return fiftyFiftyStatusColor;
};
