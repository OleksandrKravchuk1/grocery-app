import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from "@/constants/theme";

export default function SupportScreen() {
    const theme = useTheme();
    return (
        <View style={[styles.container, {backgroundColor: theme.screen}]}>
            <Text style={[styles.text, {color: theme.text}]} accessibilityRole="header">Support Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
    },
});
