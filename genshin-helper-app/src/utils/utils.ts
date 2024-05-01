export const capitalizeString = (str: string) => {
    const split = str.split(/\s+/);
    return split
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};
