import {ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {Entypo, Ionicons, MaterialIcons} from "@expo/vector-icons";
import BannerList from "@/components/banners/BannerList";
import CategoriesList from "@/components/category/CategoriesList";
import CategorySection from "@/components/category/CategorySection";
import {useCategory} from "@/hooks/useCategory";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useLocation} from "@/context/LocationContext";
import {useRouter} from "expo-router";
import {useTheme} from "@/constants/theme";

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const androidHeaderOffset = Platform.OS === 'android' ? insets.top + 56 : 0;

    const {categories, isLoading, error} = useCategory();
    const {address} = useLocation();

    if (isLoading) return <ActivityIndicator accessibilityLabel="Loading home content"/>
    if (error) return <Text accessibilityRole="alert">{error}</Text>

    return (
        <ScrollView
            style={{backgroundColor: theme.screen}}
            contentInsetAdjustmentBehavior='automatic'
            contentContainerStyle={[styles.scrollContent, Platform.OS === 'android' && {paddingTop: androidHeaderOffset}]}
            showsVerticalScrollIndicator={false}
            accessibilityLabel='Home'
            accessibilityHint='Browse through the available food categories and promotions'
        >

            {/* HEADER */}
            <View style={styles.header}>
                <Pressable
                    style={styles.addressContainer}
                    accessibilityRole='button'
                    accessibilityLabel={`Current delivery address: ${address}`}
                    accessibilityHint='Opens the location picker to select your delivery address'
                    onPress={() => router.push('/(modals)/location-picker')}
                >
                    <MaterialIcons name="delivery-dining"
                                   size={28}
                                   color={theme.text}
                                   accessible={false}
                    />
                    <Text style={[styles.address, {
                        color: theme.text
                    }]}
                          numberOfLines={1}
                          ellipsizeMode='tail'
                    >
                        {address}
                    </Text>
                    <Entypo name='chevron-small-down'
                            size={24}
                            color={theme.text}
                            accessible={false}
                    />
                </Pressable>
                <Pressable
                    style={styles.bagIcon}
                    onPress={() => router.push('/home/cart')}
                    accessibilityRole='button'
                    accessibilityLabel='Shopping Cart'
                    accessibilityHint='View items in your shopping cart'
                >
                    <Ionicons name="bag-outline" size={24}
                              color={theme.text}
                              accessible={false}/>
                </Pressable>
            </View>

            {/* MAIN CONTENT*/}
            <View style={styles.content}>
                <View style={styles.banner}>
                    <BannerList/>
                </View>
                <View
                    style={styles.categories}
                    accessibilityRole='list'
                    accessibilityLabel='Categories'
                    accessibilityHint='Browse through the available food categories'
                >
                    <CategoriesList/>
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
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    address: {
        fontSize: 18,
        paddingHorizontal: 8,
        flexShrink: 1,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'stretch',
        width: '100%',
        paddingTop: 8,
    },
    bagIcon: {
        justifyContent: 'center',
        alignItems: 'center',
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