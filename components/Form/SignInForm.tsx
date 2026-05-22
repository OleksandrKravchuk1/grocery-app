import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, useColorScheme, View, Platform, StyleSheet } from "react-native";

import { InputRow } from "@/components/ui/InputRow";
import { colors } from "@/constants/colors";
import { useTheme } from "@/constants/theme";
import { useProfileForm } from "@/hooks/forms/useProfileForm";
import { useSignOut } from "@/hooks/useSignOut";
import { useAuth } from "@/context/AuthContext";
import { GenderOption } from "@/types/profile";
import { SubmitButton } from "@/components/ui/button/SubmitButton";
import { SignOutButton } from "../ui/button/DangerButton";

const genderOptions: GenderOption[] = ["Male", "Female", "Other"];

export function SignInForm() {
    const { user } = useAuth();
    const { form, isSaving } = useProfileForm();
    const { signOut } = useSignOut();
    const theme = useTheme();
    const isDark = useColorScheme() === "dark";

    return (
        <ScrollView
            style={{ backgroundColor: theme.screen }}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.avatarWrap}>
                <View style={[styles.avatarCircle, { borderColor: theme.inputBorder }]}>
                    <Ionicons name="person" size={64} color={theme.muted} accessible={false} />
                </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]} accessibilityRole="header">
                    Personal data
                </Text>
                <Text style={[styles.sectionHint, { color: theme.muted }]}>Name and surname</Text>

                <form.Field
                    name="firstName"
                    children={(field) => (
                        <InputRow
                            iconName="person"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            placeholder="Name"
                        />
                    )}
                />

                <form.Field
                    name="lastName"
                    children={(field) => (
                        <InputRow
                            iconName="person"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            placeholder="Surname"
                            style={styles.mt8}
                        />
                    )}
                />

                <Text style={[styles.sectionHint, styles.mt14, { color: theme.muted }]}>
                    Birthday date
                </Text>

                <form.Field
                    name="birthday"
                    children={(field) => (
                        <InputRow
                            iconName="calendar-month"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            placeholder="Birthday"
                        />
                    )}
                />
            </View>

            <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.sectionHint, styles.mt14, { color: theme.muted }]}>Gender</Text>
                <View style={styles.genderRow}>
                    <form.Field
                        name="gender"
                        children={(field) =>
                            genderOptions.map((item) => {
                                const selected = field.state.value === item;
                                return (
                                    <Pressable
                                        key={item}
                                        style={[
                                            styles.genderButton,
                                            {
                                                backgroundColor: selected
                                                    ? isDark
                                                        ? colors.selectedGenderDark
                                                        : colors.selectedGenderLight
                                                    : theme.card,
                                                borderColor: selected ? theme.accent : theme.inputBorder,
                                            },
                                        ]}
                                        onPress={() => field.handleChange(item)}
                                        accessibilityRole="radio"
                                        accessibilityState={{ selected }}
                                        accessibilityLabel={item}
                                        accessibilityHint="Selects this gender option"
                                    >
                                        <Text style={[styles.genderText, { color: selected ? theme.accent : theme.text }]}>
                                            {item}
                                        </Text>
                                    </Pressable>
                                );
                            })
                        }
                    />
                </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.sectionTitle, styles.mt18, { color: theme.text }]} accessibilityRole="header">
                    Contact
                </Text>
                <Text style={[styles.sectionHint, { color: theme.muted }]}>Phone number</Text>

                <form.Field
                    name="phone"
                    children={(field) => (
                        <InputRow
                            iconName="phone"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            placeholder="+380 XX XXX XX XX"
                            keyboardType="phone-pad"
                        />
                    )}
                />

                <Text style={[styles.sectionHint, styles.mt14, { color: theme.muted }]}>Email</Text>
                <View style={[styles.inputRow, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                    <MaterialIcons name="email" size={18} color={theme.accent} accessible={false} />
                    <Text style={[styles.emailText, { color: theme.muted }]}>{user?.email ?? "E-mail"}</Text>
                </View>

                <SubmitButton onPress={form.handleSubmit} isSaving={isSaving} />
                <SignOutButton onPress={signOut} isSaving={isSaving} />
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
    loader: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 28,
    },
    avatarWrap: {
        alignItems: "center",
        marginTop: 130,
        marginBottom: 12,
    },
    avatarCircle: {
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
    emailText: {
        fontSize: 16,
        fontWeight: "500",
    },
    inputRow: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    genderRow: {
        flexDirection: "row",
        gap: 8,
    },
    genderButton: {
        flex: 1,
        minHeight: 42,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    genderText: {
        fontSize: 14,
        fontWeight: "600",
    },
    mt8: {
        marginTop: 8,
    },
    mt14: {
        marginTop: 14,
    },
    mt18: {
        marginTop: 18,
    },
});