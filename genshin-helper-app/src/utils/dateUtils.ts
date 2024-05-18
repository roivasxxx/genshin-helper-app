import { SERVER_TIME_OFFSET } from "@/contants";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

export const getTimeOffset = (server: SERVER_TIME_OFFSET) => {
    return SERVER_TIME_OFFSET[server];
};

/**
 * Get time difference between current timezone and provided server timezone
 * Result is in minutes
 */
export const getTimeDifference = (server: SERVER_TIME_OFFSET) => {
    const now = dayjs();
    const local = now.utcOffset();
    const serverTime = now.utcOffset(getTimeOffset(server)).utcOffset();
    return serverTime - local;
};

export const getTimeDifferenceAsia = () => {
    const now = dayjs();
    const local = now.utcOffset();
    const serverTime = now
        .utcOffset(getTimeOffset(SERVER_TIME_OFFSET.ASIA))
        .utcOffset();
    return serverTime - local;
};

export const getCurrentDay = (server: SERVER_TIME_OFFSET) => {
    const time = dayjs().utcOffset(getTimeOffset(server));
    let day = time.day();
    if (time.hour() >= 0 && time.hour() < 4) {
        day -= 1;
    }

    if (day === -1) {
        day = 6;
    }

    return weekdays[day];
};
