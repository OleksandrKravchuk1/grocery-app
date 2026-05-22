import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SubmitButton } from "@/components/ui/button/SubmitButton";
import { InputRow } from "@/components/ui/row/InputRow";
import { useTheme } from "@/constants/theme";
import { useAuthForm } from "@/hooks/forms/useAuthForm";

export default function Auth() {
    const { form, handleSignIn, handleSignUp, isSubmitting } = useAuthForm();
    const theme = useTheme();

    return (
        <ScrollView
            style={{ backgroundColor: theme.screen }}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.logoWrap}>
                <View style={[styles.logoCircle, { borderColor: theme.inputBorder }]}>
                    <Ionicons name="storefront" size={64} color={theme.muted} accessible={false} />
                </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]} accessibilityRole="header">
                    Welcome back
                </Text>
                <Text style={[styles.sectionHint, { color: theme.muted }]}>
                    Sign in to continue shopping
                </Text>

                <form.Field
                    name="email"
                    children={(field) => (
                        <View>
                            <InputRow
                                iconName="email"
                                value={field.state.value}
                                onChangeText={field.handleChange}
                                onBlur={field.handleBlur}
                                placeholder="email@address.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                <Text style={[styles.errorText, { color: theme.danger }]}>
                                    {String(field.state.meta.errors[0])}
                                </Text>
                            )}
                        </View>
                    )}
                />

                <form.Field
                    name="password"
                    children={(field) => (
                        <View style={styles.mt8}>
                            <InputRow
                                iconName="lock"
                                value={field.state.value}
                                onChangeText={field.handleChange}
                                onBlur={field.handleBlur}
                                placeholder="Password"
                                secureTextEntry
                                autoCapitalize="none"
                            />
                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                <Text style={[styles.errorText, { color: theme.danger }]}>
                                    {String(field.state.meta.errors[0])}
                                </Text>
                            )}
                        </View>
                    )}
                />
            </View>

            <View style={[styles.card, { backgroundColor: theme.card }]}>
                <SubmitButton
                    onPress={handleSignIn}
                    isSaving={isSubmitting}
                />

                <Pressable
                    onPress={handleSignUp}
                    disabled={isSubmitting}
                    style={[styles.secondaryButton, { borderColor: theme.inputBorder }, isSubmitting && styles.disabled]}
                    accessibilityRole="button"
                    accessibilityLabel="Create account"
                >
                    <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
                        Create account
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const cardShadow = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
    },
    android: {
        elevation: 3,
    },
    default: {},
});

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 28,
    },
    logoWrap: {
        alignItems: "center",
        marginTop: 130,
        marginBottom: 12,
    },
    logoCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
    },
    card: {
        borderRadius: 16,
        padding: 16,
        marginVertical: 10,
        ...cardShadow,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "600",
    },
    sectionHint: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 6,
    },
    errorText: {
        fontSize: 12,
        fontWeight: "500",
        marginTop: 4,
        marginLeft: 4,
    },
    secondaryButton: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    disabled: {
        opacity: 0.5,
    },
    mt8: {
        marginTop: 8,
    },
});