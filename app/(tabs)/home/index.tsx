import { CartButton } from "@/features/cart/components/CartButton";
import { AddressView } from "@/features/location/components/AddressView";
import { ErrorView } from "@/src/components/ui/view/ErrorView";
import { LoadingView } from "@/src/components/ui/view/LoadingView";
import { useTheme } from "@/src/constants/theme";
import { useLocation } from "@/src/context/LocationContext";
import BannerList from "@/src/features/banners/components/BannerList";
import CategoriesList from "@/src/features/category/components/CategoriesList";
import CategorySection from "@/src/features/category/components/CategorySection";
import { useCategory } from "@/src/features/category/hooks/useCategory";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const androidHeaderOffset = Platform.OS === 'android' ? insets.top + 56 : 0;

    const { categories, isLoading, error } = useCategory();
    const { address } = useLocation();

    if (isLoading) return <LoadingView accessibilityLabel="Loading home content" />
    if (error) return <ErrorView message="Failed to load home content" />

    return (
        <ScrollView
            style={{ backgroundColor: theme.screen }}
            contentInsetAdjustmentBehavior='automatic'
            contentContainerStyle={[styles.scrollContent, Platform.OS === 'android' && { paddingTop: androidHeaderOffset }]}
            showsVerticalScrollIndicator={false}
            accessibilityLabel='Home'
            accessibilityHint='Browse through the available food categories and promotions'
        >

            {/* HEADER */}
            <View style={styles.header}>
                <AddressView address={address} />
                <CartButton />
            </View>

            {/* MAIN CONTENT*/}
            <View style={styles.content}>
                <View style={styles.banner}>
                    <BannerList />
                </View>
                <View
                    style={styles.categories}
                    accessibilityRole='list'
                    accessibilityLabel='Categories'
                    accessibilityHint='Browse through the available food categories'
                >
                    <CategoriesList />
                </View>

                {categories.map((category) => (
                    <CategorySection
                        key={category.id}
                        title={category.name}
                        category_id={category.id}
                    />
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 12,
    },

    content: {
        justifyContent: 'center',
        alignItems: 'stretch',
        width: '100%',
        paddingTop: 8,
    },
    banner: {
        marginTop: 8,
        marginBottom: 12,
    },
    categories: {
        marginTop: 8,
        marginBottom: 12,
    },
    products: {
        marginTop: 8,
        marginBottom: 12,
    },
});