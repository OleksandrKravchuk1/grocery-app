import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";

import Auth from "@/components/auth/Auth";
import { InputRow } from "@/components/ui/InputRow";
import { colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { getProfiles, upsertProfile } from "@/db/profiles";
import { usePressAnimation } from "@/hooks/usePressAnimation";
import { supabase } from "@/lib/supabase";
import { ProfileForm } from "@/types/profile";
import Animated from "react-native-reanimated";

type GenderOption = "Male" | "Female" | "Other";

const initialForm: ProfileForm = {
    first_name: "",
    last_name: "",
    phone: "",
    gender: "Other",
    birthday: "",
};

const genderOptions: GenderOption[] = ["Male", "Female", "Other"];

export default function Index() {
    const {user, session} = useAuth();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [form, setForm] = useState<ProfileForm>(initialForm);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);

    const {onPressIn, onPressOut, animatedStyle} = usePressAnimation({});

    const theme = useMemo(
        () => ({
            screen: isDark ? colors.black : colors.screenLight,
            card: isDark ? colors.darkGrey : colors.white,
            text: isDark ? colors.white : colors.textLight,
            muted: isDark ? colors.mutedDark : colors.mutedLight,
            inputBg: isDark ? colors.inputBgDark : colors.inputBgLight,
            inputBorder: isDark ? colors.inputBorderDark : colors.inputBorderLight,
            accent: colors.accent,
            danger: colors.danger,
        }),
        [isDark]
    );

    useEffect(() => {
        const loadProfile = async () => {
            if (!user?.id) {
                setLoadingProfile(false);
                return;
            }

            try {
                setLoadingProfile(true);
                const profile = await getProfiles(user.id);

                setForm({
                    first_name: profile?.first_name ?? "",
                    last_name: profile?.last_name ?? "",
                    phone: profile?.phone ?? "",
                    gender: toGender(profile?.gender),
                    birthday: profile?.birthday ? new Date(profile.birthday).toISOString().slice(0, 10) : "",
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : "Не вдалося завантажити профіль";
                const isMissingRow = message.includes("0 rows") || message.toLowerCase().includes("no rows");

                if (!isMissingRow) {
                    Alert.alert("Помилка", message);
                }
            } finally {
                setLoadingProfile(false);
            }
        };

        void loadProfile();
    }, [user?.id]);

    const handleSaveProfile = async () => {
        if (!user?.id) return;

        if (form.birthday && Number.isNaN(new Date(form.birthday).getTime())) {
            Alert.alert("Invalid date", "Please enter a valid date in YYYY-MM-DD format");
            return;
        }

        try {
            setSavingProfile(true);
            await upsertProfile(user.id, {
                id: user.id,
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim(),
                phone: form.phone.trim(),
                gender: form.gender,
                birthday: form.birthday ? new Date(form.birthday) : new Date(),
            });
            Alert.alert("Done", "Profile saved successfully");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to save profile";
            Alert.alert("Error", message);
        } finally {
            setSavingProfile(false);
        }
    };

    const handleSignOut = async () => {
        const {error} = await supabase.auth.signOut();
        if (error) {
            Alert.alert("Sign out error", error.message);
        }
    };

    if (!session) return <Auth/>;

    if (loadingProfile) {
        return (
            <View style={[styles.loader, {backgroundColor: theme.screen}]}>
                <ActivityIndicator accessibilityLabel="Loading profile"/>
            </View>
        );
    }

    return (
        <ScrollView
            style={{backgroundColor: theme.screen}}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.avatarWrap}>
                <View style={[styles.avatarCircle, {borderColor: theme.inputBorder}]}>
                    <Ionicons name="person" size={64} color={theme.muted} accessible={false}/>
                </View>
            </View>

            <View style={[styles.card, {backgroundColor: theme.card}]}>
                <Text style={[styles.sectionTitle, {color: theme.text}]} accessibilityRole="header">Personal data</Text>
                <Text style={[styles.sectionHint, {color: theme.muted}]}>Name and surname</Text>

                <InputRow
                    iconName="person"
                    value={form.first_name}
                    onChangeText={(value) => setForm((prev) => ({...prev, first_name: value}))}
                    placeholder="Name"
                />
                <InputRow
                    iconName="person"
                    value={form.last_name}
                    onChangeText={(value) => setForm((prev) => ({...prev, last_name: value}))}
                    placeholder="Surname"
                    style={styles.mt8}
                />

                <Text style={[styles.sectionHint, styles.mt14, {color: theme.muted}]}>Birthday date</Text>
                <InputRow
                    iconName="calendar-month"
                    value={form.birthday}
                    onChangeText={(value) => setForm((prev) => ({...prev, birthday: value}))}
                    placeholder="Birthday"
                />
            </View>


            <View style={[styles.card, {backgroundColor: theme.card}]}>
                <Text style={[styles.sectionHint, styles.mt14, {color: theme.muted}]}>Gender</Text>
                <View style={styles.genderRow}>
                    {genderOptions.map((item) => {
                        const selected = form.gender === item;
                        return (
                            <Pressable
                                key={item}
                                style={[
                                    styles.genderButton,
                                    {
                                        backgroundColor: selected
                                            ? (isDark ? colors.selectedGenderDark : colors.selectedGenderLight)
                                            : theme.card,
                                        borderColor: selected ? theme.accent : theme.inputBorder,
                                    },
                                ]}
                                onPress={() => setForm((prev) => ({...prev, gender: item}))}
                                accessibilityRole="radio"
                                accessibilityState={{selected}}
                                accessibilityLabel={item}
                                accessibilityHint="Selects this gender option"
                            >
                                <Text
                                    style={[styles.genderText, {color: selected ? theme.accent : theme.text}]}>{item}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            <View style={[styles.card, {backgroundColor: theme.card}]}>
                <Text style={[styles.sectionTitle, styles.mt18, {color: theme.text}]}
                      accessibilityRole="header">Contact</Text>
                <Text style={[styles.sectionHint, {color: theme.muted}]}>Phone number</Text>
                <InputRow
                    iconName="phone"
                    value={form.phone}
                    onChangeText={(value) => setForm((prev) => ({...prev, phone: value}))}
                    placeholder="+380 XX XXX XX XX"
                    keyboardType="phone-pad"
                />

                <Text style={[styles.sectionHint, styles.mt14, {color: theme.muted}]}>Email</Text>
                <View style={[styles.inputRow, {backgroundColor: theme.inputBg, borderColor: theme.inputBorder}]}>
                    <MaterialIcons name="email" size={18} color={theme.accent} accessible={false}/>
                    <Text style={[styles.emailText, {color: theme.muted}]}>{user?.email ?? "E-mail"}</Text>
                </View>

                <Animated.View style={[animatedStyle]}>
                    <Pressable
                        onPress={handleSaveProfile}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        disabled={savingProfile}
                        style={[styles.saveButton, {backgroundColor: theme.accent}, savingProfile && styles.disabled]}
                        accessibilityRole="button"
                        accessibilityLabel="Save profile"
                        accessibilityHint="Saves your profile changes"
                        accessibilityState={{disabled: savingProfile}}
                    >
                        <Text style={styles.saveButtonText}>{savingProfile ? "Saving..." : "Save"}</Text>
                    </Pressable>
                </Animated.View>

                <Pressable
                    onPress={handleSignOut}
                    style={[styles.dangerButton, {borderColor: theme.danger}]}
                    accessibilityRole="button"
                    accessibilityLabel="Sign out"
                    accessibilityHint="Signs you out of the app"
                >
                    <Text style={[styles.dangerButtonText, {color: theme.danger}]}>Sign out</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

function toGender(value?: string): GenderOption {
    if (value === "Male" || value === "Female" || value === "Other") {
        return value;
    }
    return "Other";
}

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
    },
    card: {
        borderRadius: 16,
        padding: 14,
        marginVertical: 8,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "600",
    },
    sectionHint: {
        fontSize: 18,
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
    saveButton: {
        marginTop: 14,
        minHeight: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "700",
    },
    dangerButton: {
        marginTop: 10,
        minHeight: 48,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    dangerButtonText: {
        fontSize: 16,
        fontWeight: "700",
    },
    disabled: {
        opacity: 0.6,
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
