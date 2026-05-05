import {FlatList, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {MENU_ITEMS} from "@/constants/menu";
import {useTheme} from "@/constants/theme";
import {useInsets} from "@/hooks/useInsets";
import {useRouter} from "expo-router";

export default function MenuScreen() {
    const router = useRouter();
    const theme = useTheme();
    const {topInset} = useInsets();

    const renderItem = ({item}: { item: typeof MENU_ITEMS[0] }) => (
        <Pressable
            style={({pressed}) => [
                styles.menuItem,
                {borderBottomColor: theme.inputBorder},
                pressed && {backgroundColor: theme.inputBg}
            ]}
            accessibilityRole='button'
            accessibilityLabel={item.title}
            onPress={() => {
                if (item.route !== 'menu/about') {
                    router.push(item.route as any);
                    return;
                }
                router.push('https://github.com/mobileapp-developer/grocery-app');
            }}
        >
            <View style={styles.menuItemContent}>
                <Ionicons name={item.icon as any} size={24} color={theme.text}/>
                <Text style={[styles.menuItemText, {color: theme.text}]}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.muted}/>
        </Pressable>
    );

    return (
        <ScrollView style={[styles.container, {
            backgroundColor: theme.screen,
            paddingTop: topInset,
        }
        ]}>
            <FlatList
                data={MENU_ITEMS}
                keyExtractor={(item) => item.title}
                renderItem={renderItem}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
    },
    listContent: {
        paddingHorizontal: 16,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    menuItemContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuItemText: {
        fontSize: 16,
        marginLeft: 12,
        fontWeight: "500",
    },
});
