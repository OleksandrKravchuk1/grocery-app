import { MaterialIcons } from "@expo/vector-icons";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SubmitButton } from "@/src/components/ui/button/SubmitButton";
import { InputRow } from "@/src/components/ui/row/InputRow";

import { useAppTheme } from "@/src/context/ThemeContext";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { useProfileForm } from "@/src/features/profile/hooks/useProfileForm";
import { GenderOption } from "@/src/types/profile";

const genderOptions: GenderOption[] = ["Male", "Female", "Other"];

function FieldError({ errors }: { errors: any[] }) {
  if (!errors || errors.length === 0) return null;
  const message = typeof errors[0] === "string" ? errors[0] : String(errors[0]);
  return <Text style={styles.errorText}>{message}</Text>;
}

export function EditProfileScreen() {
  const { user } = useAuth();
  const { form, isSaving } = useProfileForm();
  const { colors: theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: theme.screen }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Platform.OS === "android" ? insets.top + 56 : 0 },
      ]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Personal Data */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]} accessibilityRole="header">
          Personal data
        </Text>
        <Text style={[styles.sectionHint, { color: theme.muted }]}>Name and surname</Text>

        <form.Field name="firstName">
          {(field: any) => (
            <View>
              <InputRow
                iconName="person"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Name"
                accessibilityLabel="First name"
                accessibilityHint="Enter your first name"
              />
              {field.state.meta.isTouched && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </View>
          )}
        </form.Field>

        <form.Field name="lastName">
          {(field: any) => (
            <View style={styles.mt8}>
              <InputRow
                iconName="person"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Surname"
                accessibilityLabel="Last name"
                accessibilityHint="Enter your last name"
              />
              {field.state.meta.isTouched && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </View>
          )}
        </form.Field>

        <Text style={[styles.sectionHint, styles.mt14, { color: theme.muted }]}>
          Birthday date
        </Text>

        <form.Field name="birthday">
          {(field: any) => (
            <View>
              <InputRow
                iconName="calendar-month"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="YYYY-MM-DD"
                accessibilityLabel="Birthday"
                accessibilityHint="Enter your birthday in format year-month-day, for example 2000-01-31"
              />
              <Text style={[styles.fieldHint, { color: theme.muted }]}>
                Format: YYYY-MM-DD (e.g. 2000-01-31)
              </Text>
              {field.state.meta.isTouched && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </View>
          )}
        </form.Field>
      </View>

      {/* Gender */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionHint, { color: theme.muted }]}>Gender</Text>
        <View style={styles.genderRow}>
          <form.Field name="gender">
            {(field: any) =>
              genderOptions.map((item) => {
                const selected = field.state.value === item;
                return (
                  <Pressable
                    key={item}
                    style={[
                      styles.genderButton,
                      {
                        backgroundColor: selected
                          ? theme.genderSelectedBg
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
          </form.Field>
        </View>
      </View>

      {/* Contact */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]} accessibilityRole="header">
          Contact
        </Text>
        <Text style={[styles.sectionHint, { color: theme.muted }]}>Phone number</Text>

        <form.Field name="phone">
          {(field: any) => (
            <View>
              <InputRow
                iconName="phone"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="+380 XX XXX XX XX"
                keyboardType="phone-pad"
                accessibilityLabel="Phone number"
                accessibilityHint="Enter your phone number"
              />
              {field.state.meta.isTouched && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </View>
          )}
        </form.Field>

        <Text style={[styles.sectionHint, styles.mt14, { color: theme.muted }]}>Email</Text>
        <View style={[styles.inputRow, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
          <MaterialIcons name="email" size={18} color={theme.accent} accessible={false} />
          <Text style={[styles.emailText, { color: theme.muted }]}>{user?.email ?? "E-mail"}</Text>
        </View>

        {/* Form-level errors */}
        <form.Subscribe selector={(state: any) => state.errors}>
          {(errors: any[]) =>
            errors && errors.length > 0 ? (
              <View style={styles.formErrorWrap}>
                {errors.map((err: any, i: number) => (
                  <Text key={i} style={[styles.formErrorText, { color: theme.danger }]}>
                    {String(err)}
                  </Text>
                ))}
              </View>
            ) : null
          }
        </form.Subscribe>

        <SubmitButton onPress={() => form.handleSubmit()} isSaving={isSaving} />
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
  fieldHint: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#F04B3E",
    marginTop: 4,
    marginLeft: 4,
  },
  formErrorWrap: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F04B3E12",
  },
  formErrorText: {
    fontSize: 13,
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
});
