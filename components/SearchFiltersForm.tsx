import {Category} from "@/types/category";
import {SearchSortBy} from "@/types/product";
import {PRICE_PRESETS, PricePreset, SORT_OPTIONS} from "@/constants/search";
import {useTheme} from "@/constants/theme";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import Chip from "@/components/Chip";

type Props = {
    categories: Category[];
    selectedCategoryId: number | null;
    onSelectCategory: (categoryId: number | null) => void;

    selectedPricePreset: PricePreset;
    onSelectPricePreset: (preset: PricePreset) => void;

    selectedSortBy: SearchSortBy;
    onSelectSortBy: (sortBy: SearchSortBy) => void;
};

export default function SearchFiltersForm({
    categories,
    selectedCategoryId,
    onSelectCategory,
    selectedPricePreset,
    onSelectPricePreset,
    selectedSortBy,
    onSelectSortBy,
}: Props) {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, {color: theme.text}]} accessibilityRole='header'>
                Category
            </Text>
            <ScrollView horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.row}
                        accessibilityRole='list'
                        accessibilityLabel='Category filters'
                        accessibilityHint='Browse available category options'
            >
                <Chip label='All'
                      selected={selectedCategoryId === null}
                      onPress={() => onSelectCategory(null)}
                />
                {categories.map((category) => (
                    <Chip key={category.id}
                          label={category.name}
                          selected={selectedCategoryId === category.id}
                          onPress={() => onSelectCategory(category.id)}
                    />
                ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, {color: theme.text}]} accessibilityRole='header'>
                Price
            </Text>
            <ScrollView horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.row}
                        accessibilityRole='list'
                        accessibilityLabel='Price filters'
                        accessibilityHint='Browse available price options'
            >
                {PRICE_PRESETS.map((preset) => (
                    <Chip
                        key={preset.key}
                        label={preset.label}
                        selected={selectedPricePreset === preset.key}
                        onPress={() => onSelectPricePreset(preset.key)}
                    />
                ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, {color: theme.text}]} accessibilityRole='header'>
                Sort by
            </Text>
            <ScrollView horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.row}
                        accessibilityRole='list'
                        accessibilityLabel='Sort options'
                        accessibilityHint='Browse available sort options'
            >
                {SORT_OPTIONS.map((option) => (
                    <Chip
                        key={option.key}
                        label={option.label}
                        selected={selectedSortBy === option.key}
                        onPress={() => onSelectSortBy(option.key)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    row: {
        gap: 8,
        paddingRight: 8,
    },
});