import { FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { useCategory } from "@/hooks/useCategory";
import { LoadingView } from "../ui/view/LoadingView";
import { ErrorView } from "../ui/view/ErrorView";

const CategoriesList = () => {
    const { categories, isLoading, error } = useCategory();

    const router = useRouter();
    const colorScheme = useColorScheme();

    if (isLoading) return <LoadingView accessibilityLabel="Loading categories" />;
    if (error) return <ErrorView message="Failed to load categories" />;

    return (
        <FlatList
            data={categories}
            keyExtractor={item => item.id.toString()}
            horizontal={true}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Pressable
                        style={[styles.container, { backgroundColor: colorScheme === "dark" ? colors.darkGrey : colors.lightGrey },]}
                        onPress={() => router.push({
                            pathname: "/(tabs)/home/[categoryId]",
                            params: {
                                categoryId: item.id.toString(),
                                title: item.name,
                            },
                        })}>
                        <Text style={styles.icon}>{item.icon}</Text>
                    </Pressable>

                    <Text style={[styles.text, { color: colorScheme === "dark" ? colors.white : colors.black }]}
                        numberOfLines={1}>{item.name}</Text>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        width: 88,
        alignItems: "center",
        marginRight: 12,
    },
    container: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.lightGrey,
    },
    icon: {
        fontSize: 26,
    },
    text: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: "400",
        textAlign: "center",
    },
});

export default CategoriesList;