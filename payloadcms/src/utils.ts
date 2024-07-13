import { RecordToMap, RecordWithIcon } from "../types/types";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { WISH_REGIONS, WISH_REGION_TIMEZONES } from "./constants";
import { GenshinEvent, GenshinWish } from "../types/payload-types";

dayjs.extend(utc);
dayjs.extend(timezone);

export const sleep = (time: number) => {
    return new Promise((res, _) => {
        setTimeout(() => res("OK"), time);
    });
};

// used for weapons and character names
export const normalizeName = (name: string) => {
    return name
        .replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, "")
        .toLowerCase()
        .split(/\s+/)
        .join("_");
};

export const getIcon = (
    doc: string | Record<string, any> | undefined | null
) => {
    if (!doc || typeof doc === "string") return "";
    if (
        doc.icon &&
        typeof doc.icon !== "string" &&
        doc.icon.cloudinary.secure_url
    ) {
        return doc.icon.cloudinary.secure_url;
    }
    return "";
};

export const relationToDictionary = (
    doc: string | RecordToMap | undefined | null
): RecordWithIcon | null => {
    if (!doc || typeof doc === "string") return null;
    return {
        name: doc.name,
        id: doc.id,
        icon: getIcon(doc),
    };
};

export const convertWishDateToUTC = (date: string, region: WISH_REGIONS) => {
    const offset = WISH_REGION_TIMEZONES[region];

    const localDate = dayjs(date).utc(true);
    const utcDate = localDate.subtract(offset, "hour");

    return utcDate.utc().format("YYYY-MM-DD HH:mm:ss");
};

export const mapGenshinEvent = (doc: GenshinEvent) => {
    const mappedDoc: {
        name: string;
        type: string;
        timezoneDependent: boolean;
        start: string;
        end: string;
        url?: string;
        bannerType?: string;
        characters?: {
            fiveStar1: RecordWithIcon;
            fiveStar2?: RecordWithIcon;
            fourStar: RecordWithIcon[];
        };
        weapons?: {
            fiveStar1: RecordWithIcon;
            fiveStar2?: RecordWithIcon;
            fourStar: RecordWithIcon[];
        };
        icon?: string;
    } = {
        name: doc.name,
        type: doc.type,
        timezoneDependent: doc.timezoneDependent || false,
        start: doc.start,
        end: doc.end,
        url: doc?.url || "",
    };

    if (doc.type === "event") {
        mappedDoc.icon = getIcon(doc);
    }

    if (doc.type === "banner") {
        mappedDoc.bannerType = doc.bannerType;
        if (doc.bannerType === "weapon" && doc.weapons) {
            mappedDoc.weapons = {
                fiveStar1: relationToDictionary(doc.weapons.fiveStar1),
                fiveStar2: relationToDictionary(doc.weapons.fiveStar2),
                fourStar: doc.weapons.fourStar.map(relationToDictionary),
            };
        } else if (doc.bannerType === "character" && doc.characters) {
            mappedDoc.characters = {
                fiveStar1: relationToDictionary(doc.characters.fiveStar1),
                fiveStar2: relationToDictionary(doc.characters.fiveStar2),
                fourStar: doc.characters.fourStar.map(relationToDictionary),
            };
        }
    }
    return mappedDoc;
};

export const wishItemWithPity = (el: GenshinWish) => {
    const doc = {
        name: "",
        pity: el.pity,
        fiftyFiftyStatus: el.fiftyFiftyStatus,
        type: "",
    };
    if (typeof el.itemId.value !== "string") {
        doc.type =
            el.itemId.relationTo === "genshin-characters"
                ? "character"
                : "weapon";
        doc.name = el.itemId.value.name;
    }
    return doc;
};
