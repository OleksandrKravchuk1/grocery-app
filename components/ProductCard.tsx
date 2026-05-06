import {Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import {colors} from "@/constants/colors";
import {Product} from "@/types/product";
import {AddToCartButton} from "@/components/AddToCartButton";
import {useTheme} from "@/constants/theme";

type Props = {
    id: number;
    image: string;
    title: string;
    rating: number;
    price: number;
    cardStyle?: StyleProp<ViewStyle>;
    onAddToFavouritesPress?: () => void;
    isFavourite?: boolean;
};

const ProductCard = ({id, image, title, rating, price, cardStyle, onAddToFavouritesPress, isFavourite = false}: Props) => {
    const theme = useTheme();

    const product: Product = {id, image, title, rating, price};

    return (
        <View style={[styles.card, {backgroundColor: theme.cardContainer}, cardStyle]}>
            <View style={styles.cardTop}>
                <View style={[styles.imageContainer, {backgroundColor: theme.imageContainer}]}>
                    <Image source={{uri: image}} style={styles.image} resizeMode="contain" accessible={false}/>
                </View>
                <Pressable
                    onPress={onAddToFavouritesPress}
                    style={[styles.favouriteButton, {backgroundColor: theme.button}]}
                    accessibilityRole="button"
                    accessibilityLabel={isFavourite ? "Remove from favourites" : "Add to favourites"}
                    accessibilityHint="Toggles this product in your favourites"
                    accessibilityState={{selected: isFavourite}}
                >
                    <FontAwesome
                        name={isFavourite ? "heart" : "heart-o"}
                        size={20}
                        color={isFavourite ? colors.favouriteActive : theme.text}
                        accessible={false}
                    />
                </Pressable>

                <AddToCartButton product={product}/>
            </View>
            <View style={styles.cardBottom}>
                <Text style={[styles.title, {color: theme.text}]}>{title}</Text>
                <View style={styles.ratingRow}>
                    <FontAwesome name="star" size={20} color="#F5B300" accessible={false}/>
                    <Text
                        style={[styles.rating, {color: theme.text}]}>{rating.toFixed(1)}</Text>
                </View>
                <Text style={[styles.price, {color: theme.text}]}>${price.toFixed(2)}</Text>
            </View>
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
    favouriteButton: {
        position: "absolute",
        right: 0,
        top: -4,
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