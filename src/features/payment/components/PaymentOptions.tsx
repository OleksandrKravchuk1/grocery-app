import { useTheme } from '@/src/constants/theme';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { PaymentPreferences } from '../types/payment';

interface PaymentOptionsProps {
  preferences: PaymentPreferences;
  onChange: (prefs: Partial<PaymentPreferences>) => void;
}

export function PaymentOptions({ preferences, onChange }: PaymentOptionsProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Other Payment Methods</Text>
        <Text style={[styles.sectionSubtitle, { color: theme.muted }]}>
          Toggle payment preferences for faster checkouts.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {/* APPLE PAY TOGGLE */}
        <View style={[styles.optionRow, { borderBottomColor: theme.border }]}>
          <View style={styles.iconContainer}>
            <FontAwesome6 name="apple-pay" size={24} color={theme.text} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Apple Pay</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>
              Use Apple Pay at checkout
            </Text>
          </View>
          <Switch
            value={preferences.useApplePay}
            onValueChange={(val) => onChange({ useApplePay: val })}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#fff"
          />
        </View>

        {/* GOOGLE PAY TOGGLE */}
        <View style={[styles.optionRow, { borderBottomColor: theme.border }]}>
          <View style={styles.iconContainer}>
            <FontAwesome6 name="google-pay" size={24} color={theme.text} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Google Pay</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>
              Use Google Pay at checkout
            </Text>
          </View>
          <Switch
            value={preferences.useGooglePay}
            onValueChange={(val) => onChange({ useGooglePay: val })}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#fff"
          />
        </View>

        {/* CASH ON DELIVERY TOGGLE */}
        <View style={styles.optionRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="cash-outline" size={22} color={theme.text} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Cash on Delivery</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>
              Pay in cash upon grocery delivery
            </Text>
          </View>
          <Switch
            value={preferences.useCashOnDelivery}
            onValueChange={(val) => onChange({ useCashOnDelivery: val })}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#fff"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
