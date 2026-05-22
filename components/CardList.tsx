import ProductCard from "@/components/product/ProductCard";
import { CardListProps } from "@/types/product";
import { FlatList } from "react-native";
import { LoadingView } from "./ui/view/LoadingView";
import { ErrorView } from "./ui/view/ErrorView";
import { useCategoryProducts } from "@/hooks/useCategoryProduct";
import { useFavouriteProducts } from "@/hooks/useFavouriteProducts";

const CardList = ({ category_id }: CardListProps) => {
    const {products, isLoading, isError, error} = useCategoryProducts(category_id);
    const {favouriteIds, loading, toggleFavourite} = useFavouriteProducts();

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
                    isFavourite={favouriteIds.includes(item.id)}
                    onAddToFavouritesPress={() => toggleFavourite(item.id)}
                />
            )}
        />
    )
};

export default CardList;