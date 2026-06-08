import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { SubmitButton } from "@/src/components/ui/button/SubmitButton";
import { InputRow } from "@/src/components/ui/row/InputRow";
import { useTheme } from "@/src/constants/theme";
import { useAuthForm } from "@/src/features/auth/hooks/useAuthForm";

export default function Auth() {
  const { form, handleSignIn, handleSignUp, isSubmitting } = useAuthForm();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.screen }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AnimatedLogo iconName="storefront" color={theme.accent} />

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
    </View>
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
  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 28,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 150,
    marginBottom: 20,
    height: 160,
  },
  pulseRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
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
