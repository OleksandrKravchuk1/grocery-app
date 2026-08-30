import {useState} from "react";
import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {router} from "expo-router";
import {useCategory} from "@/src/features/category/hooks/useCategory";
import {palette} from "@/src/constants/colors";
import SearchFiltersForm from "@/src/features/search/components/SearchFiltersForm";
import {SearchSortBy} from "@/src/types/product";
import {PricePreset} from "@/src/constants/search";
import {useInsets} from "@/src/hooks/useInsets";
import {useSearchFilters} from "@/src/context/SearchFiltersContext";
import { useAppTheme } from "@/src/context/ThemeContext";
export default function SearchFiltersModal() {
    const { colors: theme } = useAppTheme();

    const {topInset} = useInsets();
    const {categories} = useCategory();
    const {filters, setFilters} = useSearchFilters();

    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(filters.categoryId);
    const [selectedPricePreset, setSelectedPricePreset] = useState<PricePreset>(filters.pricePreset);
    const [selectedSortBy, setSelectedSortBy] = useState<SearchSortBy>(filters.sortBy);

    const onApply = () => {
        setFilters({
            categoryId: selectedCategoryId,
            pricePreset: selectedPricePreset,
            sortBy: selectedSortBy,
        });
        router.back();
    };

    return (
        <View style={[styles.container, {paddingTop: topInset, backgroundColor: theme.screen}]} accessibilityViewIsModal>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <SearchFiltersForm
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={setSelectedCategoryId}
                    selectedPricePreset={selectedPricePreset}
                    onSelectPricePreset={setSelectedPricePreset}
                    selectedSortBy={selectedSortBy}
                    onSelectSortBy={setSelectedSortBy}
                />

                <Pressable
                    style={[styles.applyButton, {backgroundColor: theme.accent}]}
                    onPress={onApply}
                    accessibilityRole="button"
                    accessibilityLabel="Apply filters"
                    accessibilityHint="Applies the selected category, price, and sort filters"
                >
                    <Text style={[styles.applyButtonText]}>Apply</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 20,
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    secondaryButtonText: {
        color: palette.black,
        fontSize: 14,
        fontWeight: "700",
    },
    applyButton: {
        marginTop: 8,
        height: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    applyButtonText: {
        color: palette.white,
        fontSize: 16,
        fontWeight: "700",
    },
});