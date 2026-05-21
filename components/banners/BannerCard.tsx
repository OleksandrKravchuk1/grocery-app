import {Dimensions, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View} from "react-native";
import {isWhite} from "@/utilities/isWhite";

type Props = {
    title: string;
    subtitle: string;
    color: string;
    buttonColor: string;
    titleColor: string;
    subtitleColor: string;
    image: ImageSourcePropType;
};

const BannerCard = ({title, subtitle, color, titleColor, subtitleColor, buttonColor, image}: Props) => {
    const {width} = Dimensions.get('window');
    const buttonTextColor = isWhite(buttonColor) ? "#111111" : "#FFFFFF";

    return (
        <View style={styles.container}>
            <View style={[styles.card, {backgroundColor: color, width: width - 16,}]}>
                <View style={styles.content}>
                    <View style={styles.leftSection}>
                        <Text style={[styles.title, {color: titleColor}]}>{title}</Text>
                        <Text style={[styles.subtitle, {color: subtitleColor}]}>{subtitle}</Text>

                        <Pressable style={[styles.button, {backgroundColor: buttonColor}]}>
                            <Text style={[styles.buttonText, {color: buttonTextColor}]}>Shop Now</Text>
                        </Pressable>
                    </View>

                    <View style={styles.imageWrapper}>
                        <Image source={image} style={styles.image} resizeMode="contain" />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    card: {
        height: 210,
        borderRadius: 18,
        overflow: "hidden",
        paddingLeft: 22,
        paddingVertical: 20,
    },
    content: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    leftSection: {
        flex: 1,
        maxWidth: "52%",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
    },
    subtitle: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: "700",
    },
    button: {
        marginTop: 18,
        alignSelf: "flex-start",
        borderRadius: 8,
        paddingHorizontal: 22,
        paddingVertical: 12,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "700",
    },
    imageWrapper: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },
    image: {
        width: 200,
        height: 170,
    },
});

export default BannerCard;