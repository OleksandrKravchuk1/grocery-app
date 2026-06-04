import { ErrorView } from "@/src/components/ui/view/ErrorView";
import { LoadingView } from "@/src/components/ui/view/LoadingView";
import { useFavoriteProducts } from "@/src/features/favorites/hooks/useFavoriteProducts";
import ProductCard from "@/src/features/product/components/ProductCard";
import { useCategoryProducts } from "@/src/features/product/hooks/useCategoryProducts";
import { CardListProps } from "@/src/types/product";
import { FlatList } from "react-native";

const CardList = ({ category_id }: CardListProps) => {
  const { products, isLoading, isError, error } = useCategoryProducts(category_id);
  const { favoriteIds, loading, toggleFavorite } = useFavoriteProducts();

  if (isLoading || loading) return <LoadingView accessibilityLabel="Loading products" />
  if (isError || error) return <ErrorView message={error || "Failed to load products"} />

  return (
    <FlatList
      data={products.slice(0, 5)}
      keyExtractor={(item, index) => `${item.id}-${item.title}-${index}`}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      renderItem={({ item }) => (
        <ProductCard
          id={item.id}
          image={item.image}
          title={item.title}
          rating={item.rating}
          price={item.price}
          isFavorite={favoriteIds.includes(item.id)}
          onAddToFavoritesPress={() => toggleFavorite(item.id)}
        />
      )}
    />
  )
};

export default CardList;