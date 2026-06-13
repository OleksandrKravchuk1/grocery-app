import { AddToCartButton } from "@/components/ui/button/AddToCartButton";
import { FavoriteButton } from "@/src/components/ui/button/FavoriteButton";
import { useTheme } from "@/src/constants/theme";
import { Product } from "@/src/types/product";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

type Props = {
  id: number;
  image: string;
  title: string;
  rating: number;
  price: number;
  cardStyle?: StyleProp<ViewStyle>;
  onAddToFavoritesPress?: () => void;
  isFavorite?: boolean;
};

const ProductCard = ({ id, image, title, rating, price, cardStyle, onAddToFavoritesPress, isFavorite = false }: Props) => {
  const theme = useTheme();
  const router = useRouter();

  const product: Product = { id, image, title, rating, price };

  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/home/product/[id]' as any,
      params: {
        id: id.toString(),
      }
    })
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.cardContainer }, cardStyle]}>
      <Pressable onPress={handlePress}>
        <View style={styles.cardTop}>
          <View style={[styles.imageContainer, { backgroundColor: theme.imageContainer }]}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="contain" accessible={false} />
          </View>
        </View>
      </Pressable>

      <View style={styles.favoriteButtonContainer}>
        <FavoriteButton
          onAddToFavoritesPress={onAddToFavoritesPress}
          isFavorite={isFavorite}
        />
      </View>
      <View style={styles.addButtonContainer}>
        <AddToCartButton product={product} />
      </View>

      <Pressable onPress={handlePress}>
        <View style={styles.cardBottom}>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={20} color="#F5B300" accessible={false} />
            <Text style={[styles.rating, { color: theme.text }]}>{rating.toFixed(1)}</Text>
          </View>
          <Text style={[styles.price, { color: theme.text }]}>${price.toFixed(2)}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 175,
    borderRadius: 14,
    padding: 18,
    marginRight: 16
  },
  cardTop: {
    marginBottom: 16
  },
  cardBottom: {
    gap: 8
  },
  imageContainer: {
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14
  },
  image: {
    width: "95%",
    height: "95%"
  },
  favoriteButtonContainer: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 38,
    height: 38,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2
    },
    elevation: 2
  },
  addButtonContainer: {
    position: "absolute",
    right: 8,
    bottom: 120,
    width: 38,
    height: 38,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2
    },
    elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: "700"
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  rating: {
    fontSize: 16,
    fontWeight: "600"
  },
  price: {
    fontSize: 18,
    fontWeight: "700"
  },
});

export default ProductCard;
