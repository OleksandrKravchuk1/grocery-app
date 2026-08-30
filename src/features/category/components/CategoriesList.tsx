import { ErrorView } from "@/src/components/ui/view/ErrorView";
import { LoadingView } from "@/src/components/ui/view/LoadingView";
import { palette } from "@/src/constants/colors";
import { useAppTheme } from "@/src/context/ThemeContext";
import { useCategory } from "@/src/features/category/hooks/useCategory";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export function CategoriesList() {
  const { categories, isLoading, error } = useCategory();

  const router = useRouter();
  const { colors: theme } = useAppTheme();

  const handleOnPress = (categoryId: string, categoryName: string) => {
    router.push({
      pathname: "/(tabs)/home/[categoryId]",
      params: {
        categoryId: categoryId,
        title: categoryName,
      },
    })
  }

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
            style={[styles.container, { backgroundColor: theme.imageContainer },]}
            onPress={() => handleOnPress(item.id.toString(), item.name)}>
            <Text style={styles.icon}>
              {item.icon}
            </Text>
          </Pressable>

          <Text style={[styles.text, { color: theme.text }]}
            numberOfLines={1}>
            {item.name}
          </Text>
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
    backgroundColor: palette.grey100,
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
