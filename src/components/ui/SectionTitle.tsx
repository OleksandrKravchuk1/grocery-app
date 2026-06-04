import {StyleSheet, Text} from "react-native";

type Props = {
    title: string;
    color: string;
}

export const SectionTitle = ({title, color}: Props) => {
    return (
        <Text style={[styles.sectionTitle, {color}]} accessibilityRole="header">
            {title}
        </Text>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 12,
        marginTop: 8,
    },
});