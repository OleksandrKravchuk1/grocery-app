import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from "@/constants/theme";

export default function OrdersScreen() {
    const theme = useTheme();
    return (
        <View style={[styles.container, {backgroundColor: theme.screen}]}>
            <Text style={[styles.text, {color: theme.text}]}>Orders Screen</Text>
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
