import { palette } from "@/src/constants/colors";
import { useAppTheme } from "@/src/context/ThemeContext";
import { ProductList } from "@/src/features/product/components/ProductList";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  category_id: number;
}

export function CategorySection({ title, category_id }: Props) {
  const router = useRouter();
  const { colors: theme } = useAppTheme();

  const handleOnPress = () => {
    router.push({
      pathname: "/(tabs)/home/[categoryId]",
      params: {
        categoryId: category_id.toString(),
        title,
      },
    })
  }

  return (
    <>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {title}
        </Text>
        <Pressable onPress={handleOnPress}>
          <Text style={styles.viewAll}>View all</Text>
        </Pressable>

      </View>
      <View>
        <ProductList category_id={category_id} />
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
    color: palette.green,
    paddingRight: 16,
  },
});
