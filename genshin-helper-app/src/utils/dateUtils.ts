import { SERVER_TIME_OFFSET } from "@/contants";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const WEEKDAYS = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

export const DATE_FORMAT = "MMM DD,YYYY";

export const DATE_TIME_FORMAT = "MMM DD,YYYY HH:mm";

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

    return WEEKDAYS[day];
};

export const formatEventDuration = (
    start: string,
    end: string,
    timezoneDependent?: boolean,
    format?: string
) => {
    format = format || DATE_FORMAT;
    let _start;
    const _end = dayjs(end);
    if (timezoneDependent) {
        _start = dayjs.utc(start).local(); // Convert UTC start to local time
    } else {
        _start = dayjs(start); // Use the start date as is
    }

    return `${_start.format(format)} - ${_end.format(format)}`;
};

export const formatEventDate = (
    date: string,
    timezoneDependent?: boolean,
    format?: string
) => {
    format = format || DATE_FORMAT;
    let _date;
    if (timezoneDependent) {
        _date = dayjs.utc(date).local(); // Convert UTC start to local time
    } else {
        _date = dayjs(date); // Use the start date as is
    }

    return _date.format(format);
};

export const dateMatches = (
    start: string,
    end: string,
    date: Dayjs,
    timezoneDependent: boolean
) => {
    let _start: Dayjs;
    let _end: Dayjs = dayjs(end);
    if (timezoneDependent) {
        _start = dayjs.utc(start).local(); // Convert UTC start to local time
    } else {
        _start = dayjs(start); // Use the start date as is
    }

    return date.isAfter(_start) && date.isBefore(_end);
};
