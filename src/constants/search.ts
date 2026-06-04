import {SearchSortBy} from "@/types/product";

export type PricePreset = 'all' | 'under_10' | '10_25' | 'over_25';

export const PRICE_PRESETS: {key: PricePreset; label: string}[] = [
    {key: "all", label: "All prices"},
    {key: "under_10", label: "Under $10"},
    {key: "10_25", label: "$10 - $25"},
    {key: "over_25", label: "Over $25"},
];

export const SORT_OPTIONS: {key: SearchSortBy; label: string}[] = [
    {key: "relevance", label: "Relevance"},
    {key: "price_asc", label: "Price ↑"},
    {key: "price_desc", label: "Price ↓"},
    {key: "rating_desc", label: "Rating ↓"},
];