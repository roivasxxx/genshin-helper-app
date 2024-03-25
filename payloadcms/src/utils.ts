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
