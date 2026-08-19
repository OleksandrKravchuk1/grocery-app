import { useTheme } from "@/src/constants/theme";
import { FAQ_ITEMS } from "@/src/features/support/constants/faq";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function SupportScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // FAQ
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFaq = useCallback(
    (index: number) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpandedIndex((prev) => (prev === index ? null : index));
    },
    [],
  );

  // Contact form
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = useCallback(() => {
    if (!subject.trim()) {
      Alert.alert("Missing Subject", "Please enter a subject for your message.");
      return;
    }
    if (!message.trim()) {
      Alert.alert("Missing Message", "Please describe your issue or question.");
      return;
    }

    setIsSending(true);

    // Simulate sending
    setTimeout(() => {
      setIsSending(false);
      setSubject("");
      setMessage("");
      Alert.alert(
        "Message Sent ✓",
        "Thank you for reaching out! Our support team will get back to you within 24 hours.",
      );
    }, 800);
  }, [subject, message]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.screen }]}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Platform.OS === "android" ? insets.top + 56 : 16,
            paddingBottom: insets.bottom + 24,
          },
        ]}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── FAQ ─── */}
        <View style={[styles.card, { backgroundColor: theme.card, ...cardShadow }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: `${theme.accent}15` }]}>
              <Ionicons name="help-circle-outline" size={22} color={theme.accent} />
            </View>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Frequently Asked Questions
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.muted }]}>
                Find quick answers below
              </Text>
            </View>
          </View>

          {FAQ_ITEMS.map((item, index) => {
            const isExpanded = expandedIndex === index;
            const isLast = index === FAQ_ITEMS.length - 1;

            return (
              <View key={index}>
                <Pressable
                  onPress={() => toggleFaq(index)}
                  style={[
                    styles.faqRow,
                    !isLast && !isExpanded && { borderBottomColor: theme.border, borderBottomWidth: 1 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={item.question}
                  accessibilityState={{ expanded: isExpanded }}
                >
                  <Text style={[styles.faqQuestion, { color: theme.text }]}>
                    {item.question}
                  </Text>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={theme.muted}
                  />
                </Pressable>

                {isExpanded && (
                  <View
                    style={[
                      styles.faqAnswer,
                      !isLast && { borderBottomColor: theme.border, borderBottomWidth: 1 },
                    ]}
                  >
                    <Text style={[styles.faqAnswerText, { color: theme.muted }]}>
                      {item.answer}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* ─── Contact Form ─── */}
        <View style={[styles.card, { backgroundColor: theme.card, ...cardShadow }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: `${theme.accent}15` }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={22} color={theme.accent} />
            </View>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Us</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.muted }]}>
                We&apos;d love to hear from you
              </Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Subject</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.text,
                },
              ]}
              value={subject}
              onChangeText={setSubject}
              placeholder="e.g. Order issue, Account question..."
              placeholderTextColor={theme.muted}
              returnKeyType="next"
              accessibilityLabel="Subject"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Message</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.text,
                },
              ]}
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your issue or question in detail..."
              placeholderTextColor={theme.muted}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              accessibilityLabel="Message"
            />
          </View>

          <Pressable
            style={[
              styles.sendButton,
              {
                backgroundColor: theme.accent,
                opacity: isSending ? 0.7 : 1,
              },
            ]}
            onPress={handleSend}
            disabled={isSending}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Ionicons name="send-outline" size={18} color="white" />
            <Text style={styles.sendButtonText}>
              {isSending ? "Sending..." : "Send Message"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  android: {
    elevation: 2,
  },
  default: {},
}) as object;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },

  /* ── FAQ ── */
  faqRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  faqAnswer: {
    paddingBottom: 14,
    paddingLeft: 4,
    paddingRight: 4,
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 22,
  },

  /* ── Form ── */
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 14,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
