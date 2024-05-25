import { RecordToMap } from "../types/types";

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

export const relationToDictionary = (doc: string | RecordToMap) => {
    if (typeof doc === "string") return "";
    let icon = "";
    if (
        doc.icon &&
        typeof doc.icon !== "string" &&
        doc.icon.cloudinary.secure_url
    ) {
        icon = doc.icon.cloudinary.secure_url;
    }
    return {
        name: doc.name,
        id: doc.id,
        icon,
    };
};
