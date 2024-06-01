import { RecordToMap, RecordWithIcon } from "../types/types";

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
