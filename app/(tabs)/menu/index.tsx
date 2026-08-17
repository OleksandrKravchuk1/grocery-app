import { MENU_ITEMS } from "@/src/constants/menu";
import { useTheme } from "@/src/constants/theme";
import { ProfileMenuItem } from "@/src/features/profile/components/ProfileMenuItem";
import { useRouter } from "expo-router";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MenuScreen() {
    const router = useRouter();
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={[styles.scrollView, { backgroundColor: theme.screen }]}
            contentContainerStyle={[
                styles.content,
                { paddingTop: Platform.OS === "android" ? insets.top + 56 : 0, paddingBottom: insets.bottom + 24 },
            ]}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            accessibilityLabel="More"
            accessibilityHint="Browse additional app options"
        >
            <View style={[styles.menuCard, { backgroundColor: theme.card, ...cardShadow }]}>
                <Text style={[styles.menuTitle, { color: theme.text }]} accessibilityRole="header">
                    More
                </Text>

                {MENU_ITEMS.map((item) => (
                    <ProfileMenuItem
                        key={item.title}
                        icon={item.icon as any}
                        label={item.title}
                        onPress={() => {
                            if (item.route !== 'menu/about') {
                                router.push(item.route as any);
                                return;
                            }
                            router.push('https://github.com/mobileapp-developer/grocery-app');
                        }}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

const cardShadow = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
    },
    android: {
        elevation: 3,
    },
    default: {},
}) as object;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
    },
    menuCard: {
        borderRadius: 16,
        overflow: "hidden",
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: "600",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 4,
    },
});
