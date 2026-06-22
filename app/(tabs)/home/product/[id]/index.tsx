import { Feather, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackButton } from "@/components/ui/button/BackButton";
import { FavoriteButton } from "@/components/ui/button/FavoriteButton";
import { useFavoriteProducts } from "@/features/favorites/hooks/useFavoriteProducts";
import { getMockBadges } from "@/features/product/services/product";
import { ErrorView } from "@/src/components/ui/view/ErrorView";
import { LoadingView } from "@/src/components/ui/view/LoadingView";
import { useTheme } from "@/src/constants/theme";
import { useCart } from "@/src/features/cart/context/CartContext";
import { ProductBadges } from "@/src/features/product/components/ProductBadges";
import { useProduct } from "@/src/features/product/hooks/useProduct";
import { ProductBadge } from "@/types/product";
import { useMemo } from "react";

const { height } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { toggleFavorite } = useFavoriteProducts();
  const { data: product, isLoading, error, refetch } = useProduct(Number(id));
  const { getQuantity, addToCart, updateQuantity, removeFromCart } = useCart();

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-100, 0, 200],
      [1.25, 1, 0.75],
      "clamp"
    );

    const translateY = interpolate(
      scrollY.value,
      [-100, 0, 200],
      [0, 0, -45],
      "clamp"
    );

    const opacity = interpolate(
      scrollY.value,
      [0, 200],
      [1, 0],
      "clamp"
    );

    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });

  if (isLoading) {
    return <LoadingView />;
  }

  if (error || !product) {
    return <ErrorView message="Failed to load product details." onRetry={refetch} />;
  }

  const quantity = getQuantity(product);

  const productBadges: ProductBadge[] = useMemo(() => {
    return getMockBadges(product?.id);
  }, [product?.id]);

  const handleDec = () => quantity === 1 ? removeFromCart(product) : updateQuantity(product, quantity - 1);
  const handleInc = () => updateQuantity(product, quantity + 1);
  const handleAdd = () => addToCart(product);

  return (
    <View style={[styles.container, { backgroundColor: theme.cardContainer }]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.imageContainer, { backgroundColor: theme.screen }, imageAnimatedStyle]}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel={`${product.title} image`}
        />
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageSpacer} />

        <View style={[styles.contentContainer, { backgroundColor: theme.card }]}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.text }]}>{product.title}</Text>
            <View style={styles.favoriteContainer}>
              <FavoriteButton onAddToFavoritesPress={() => toggleFavorite(product.id)} />
            </View>
          </View>

          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={24} color="#F5B300" accessible={false} />
            <Text style={[styles.rating, { color: theme.text }]}>{product.rating.toFixed(1)}</Text>
          </View>

          <Text style={[styles.price, { color: theme.text }]}>${product.price.toFixed(2)}</Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
            <Text style={[styles.description, { color: theme.muted }]}>
              Fresh and delicious {product.title.toLowerCase()}, carefully selected for the best quality. Perfect for your daily needs and guaranteed to
              bring natural goodness to your meals.
            </Text>
          </View>

          <ProductBadges badges={productBadges} />

          <View style={[styles.actionContainer, { paddingBottom: insets.bottom || 24 }]}>
            {quantity === 0 && (
              <Pressable
                style={[styles.primaryButton, { backgroundColor: theme.text }]}
                onPress={handleAdd}
                accessibilityRole="button"
                accessibilityLabel="Add to Cart"
              >
                <Feather name="shopping-bag" size={20} color={theme.cardContainer} />
                <Text style={[styles.primaryButtonText, { color: theme.cardContainer }]}>Add to Cart</Text>
              </Pressable>
            )}
            {quantity > 0 && (
              <View style={[styles.quantityContainer, { borderColor: theme.border }]}>
                <Pressable
                  style={styles.qtyBtn}
                  onPress={handleDec}
                  accessibilityRole="button"
                  accessibilityLabel="Decrease quantity"
                >
                  <Feather name={quantity === 1 ? "trash-2" : "minus"} size={22} color={theme.text} />
                </Pressable>
                <Text style={[styles.qtyText, { color: theme.text }]}>{quantity}</Text>
                <Pressable
                  style={styles.qtyBtn}
                  onPress={handleInc}
                  accessibilityRole="button"
                  accessibilityLabel="Increase quantity"
                >
                  <Feather name="plus" size={22} color={theme.text} />
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Animated.ScrollView>

      <BackButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  imageSpacer: {
    height: height * 0.45,
    backgroundColor: "transparent",
  },
  image: {
    width: "80%",
    height: "80%",
  },
  contentContainer: {
    flexGrow: 1,
    minHeight: height * 0.55,
    marginTop: -24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    flex: 1,
    marginRight: 16,
  },
  favoriteContainer: {
    position: "relative",
    width: 38,
    height: 38,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  rating: {
    fontSize: 20,
    fontWeight: "600",
  },
  price: {
    fontSize: 32,
    fontWeight: "800",
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  actionContainer: {
    marginTop: 32,
    marginBottom: 8,
  },
  primaryButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  quantityContainer: {
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 20,
    fontWeight: "700",
  },
});
