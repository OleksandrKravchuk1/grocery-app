import {PricePreset} from "@/constants/search";
import {SearchSortBy} from "@/types/product";

export function parseNullableNumber(value: string | string[] | undefined) {
    const raw = Array.isArray(value) ? value[0] : value;
    const normalized = raw?.trim();
    if (!normalized || normalized === "null") return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}

export function parsePricePreset(value: string | string[] | undefined): PricePreset {
    const raw = Array.isArray(value) ? value[0] : value;
    if (raw === "under_10" || raw === "10_25" || raw === "over_25") return raw;
    return "all";
}

export function parseSortBy(value: string | string[] | undefined): SearchSortBy {
    const raw = Array.isArray(value) ? value[0] : value;
    if (raw === "price_asc" || raw === "price_desc" || raw === "rating_desc") return raw;
    return "relevance";
}

export function getPriceRange(pricePreset: PricePreset) {
    switch (pricePreset) {
        case "under_10":
            return {minPrice: null, maxPrice: 10};
        case "10_25":
            return {minPrice: 10, maxPrice: 25};
        case "over_25":
            return {minPrice: 25, maxPrice: null};
        default:
            return {minPrice: null, maxPrice: null};
    }
}