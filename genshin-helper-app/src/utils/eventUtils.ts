import { GenshinEvent } from "@/types/genshinTypes";
import dayjs, { Dayjs } from "dayjs";
import { dateMatches } from "./dateUtils";

export const findCurrentBanner = (
    items: GenshinEvent[],
    bannerType: "weapon" | "character",
    date: Dayjs
) => {
    for (const item of items) {
        if (
            item.type === "event" ||
            (item.type === "banner" && item.bannerType !== bannerType)
        ) {
            continue;
        }
        if (
            dateMatches(
                item.start,
                item.end,
                date,
                item.timezoneDependent || false
            )
        ) {
            return item;
        }
    }
    return null;
};

export const findCurrentEvents = (items: GenshinEvent[], date: Dayjs) => {
    const now = date;
    const events: GenshinEvent[] = [];
    for (const item of items) {
        if (item.type === "event") {
            if (
                dateMatches(
                    item.start,
                    item.end,
                    now,
                    item.timezoneDependent || false
                )
            ) {
                events.push(item);
            }
        }
    }
    return events;
};
