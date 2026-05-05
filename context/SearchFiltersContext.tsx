import {createContext, ReactNode, useContext, useMemo, useState} from "react";
import {PricePreset} from "@/constants/search";
import {SearchSortBy} from "@/types/product";

type SearchFilters = {
    categoryId: number | null;
    pricePreset: PricePreset;
    sortBy: SearchSortBy;
};

type SearchFiltersContextValue = {
    filters: SearchFilters;
    setFilters: (next: SearchFilters) => void;
    resetFilters: () => void;
};

const DEFAULT_FILTERS: SearchFilters = {
    categoryId: null,
    pricePreset: "all",
    sortBy: "relevance",
};

const SearchFiltersContext = createContext<SearchFiltersContextValue | undefined>(undefined);

export function SearchFiltersProvider({children}: {children: ReactNode}) {
    const [filters, setFiltersState] = useState<SearchFilters>(DEFAULT_FILTERS);

    const value = useMemo<SearchFiltersContextValue>(() => ({
        filters,
        setFilters: setFiltersState,
        resetFilters: () => setFiltersState(DEFAULT_FILTERS),
    }), [filters]);

    return <SearchFiltersContext.Provider value={value}>{children}</SearchFiltersContext.Provider>;
}

export function useSearchFilters() {
    const context = useContext(SearchFiltersContext);

    if (!context) {
        throw new Error("useSearchFilters must be used within a SearchFiltersProvider");
    }

    return context;
}

