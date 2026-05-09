import {Pressable, StyleSheet, Text, View} from "react-native";
import {useRouter} from "expo-router";
import {colors} from "@/constants/colors";
import CardList from "@/components/CardList";
import {useTheme} from "@/constants/theme";

type Props = {
    title: string;
    category_id: number;
}

const CategorySection = ({title, category_id}: Props) => {
    const router = useRouter();
    const theme = useTheme();

    return (
        <>
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, {color: theme.text}]}>
                    {title}
                </Text>
                <Pressable onPress={() => router.push({
                    pathname: "/(tabs)/home/[categoryId]",
                    params: {
                        categoryId: category_id.toString(),
                        title,
                    },
                })}
                >
                    <Text style={styles.viewAll}>View all</Text>
                </Pressable>

            </View>
            <View>
                <CardList category_id={category_id}/>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingLeft: 16,
        paddingTop: 20,
        paddingBottom: 10
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    viewAll: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.green,
        paddingRight: 16,
    },
});

export default CategorySection;