export const isWhite = (value: string) => {
    const normalized = value.trim().toLowerCase();
    return normalized === "#fff" || normalized === "#ffffff" || normalized === "white";
};