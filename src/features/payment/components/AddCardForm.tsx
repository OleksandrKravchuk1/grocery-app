import { useTheme } from '@/src/constants/theme';
import { formatCardNumber, formatCvc, formatExpiry } from '@/src/utilities/formatCard';
import { useForm, useStore } from '@tanstack/react-form';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { cardFormSchema, CardFormValues } from '../schemas/payment';
import { detectCardBrand } from '../services/paymentService';
import { AddCardFormProps } from '../types/payment';
import { CreditCardView } from './CreditCardView';
import { FormInput } from './FormInput';

export function AddCardForm({ onSave, onCancel }: AddCardFormProps) {
  const theme = useTheme();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      isDefault: false,
    } as CardFormValues,
    validators: {
      onSubmit: cardFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      setIsSubmitting(true);
      try {
        const success = await onSave(value);
        if (success) {
          form.reset();
        }
      } catch {
        setSubmitError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Dynamically watch form values to update the credit card visual preview in real-time
  const formValues = useStore(form.store, (state: any) => state.values);
  const detectedBrand = detectCardBrand(formValues.cardNumber);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Add New Card</Text>
        <Text style={[styles.headerSubtitle, { color: theme.muted }]}>
          Enter your card information for secure payments.
        </Text>
      </View>

      {/* LIVE CARD PREVIEW CONTAINER */}
      <CreditCardView
        cardholderName={formValues.cardholderName}
        cardNumber={formValues.cardNumber}
        expiryDate={formValues.expiryDate}
        cvv={formValues.cvv}
        brand={detectedBrand}
        flipped={focusedField === 'cvv'}
      />

      {submitError && (
        <View style={[styles.errorBox, { backgroundColor: theme.danger + '20', borderColor: theme.danger }]}>
          <Text style={[styles.errorText, { color: theme.danger }]}>{submitError}</Text>
        </View>
      )}

      {/* FORM FIELDS */}
      <View style={styles.form}>

        {/* CARDHOLDER NAME FIELD */}
        <form.Field name="cardholderName">
          {(field) => (
            <FormInput
              label="Cardholder Name"
              field={field}
              placeholder="John Doe"
              onFocus={() => setFocusedField('name')}
              autoCapitalize="characters"
              autoCorrect={false}
              accessibilityLabel="Cardholder Name"
              accessibilityHint="Enter name printed on card"
            />
          )}
        </form.Field>

        {/* CARD NUMBER FIELD */}
        <form.Field name="cardNumber">
          {(field) => (
            <FormInput
              label="Card Number"
              field={field}
              placeholder="4111 2222 3333 4444"
              keyboardType="number-pad"
              onChangeTextFormatter={formatCardNumber}
              onFocus={() => setFocusedField('number')}
              maxLength={19}
              accessibilityLabel="Card Number"
              accessibilityHint="Enter 16 digit card number"
            />
          )}
        </form.Field>

        <View style={styles.row}>
          {/* EXPIRY DATE FIELD */}
          <form.Field name="expiryDate">
            {(field) => (
              <FormInput
                label="Expiry Date"
                field={field}
                placeholder="MM/YY"
                keyboardType="number-pad"
                onChangeTextFormatter={formatExpiry}
                onFocus={() => setFocusedField('expiry')}
                maxLength={5}
                containerStyle={styles.flex1}
                accessibilityLabel="Expiry Date"
                accessibilityHint="Enter expiration month and year"
              />
            )}
          </form.Field>

          {/* CVV SECURITY CODE FIELD */}
          <form.Field name="cvv">
            {(field) => (
              <FormInput
                label="CVV"
                field={field}
                placeholder="123"
                keyboardType="number-pad"
                secureTextEntry
                onChangeTextFormatter={formatCvc}
                onFocus={() => setFocusedField('cvv')}
                maxLength={4}
                containerStyle={[styles.flex1, { marginLeft: 16 }]}
                accessibilityLabel="CVV"
                accessibilityHint="Enter 3 or 4 digit security code on back of card"
              />
            )}
          </form.Field>
        </View>

        {/* DEFAULT CARD STATUS SWITCH */}
        <form.Field name="isDefault">
          {(field) => (
            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <Text style={[styles.switchLabel, { color: theme.text }]}>Set as default card</Text>
                <Text style={[styles.switchSubtitle, { color: theme.muted }]}>
                  Use this card for primary checkouts
                </Text>
              </View>
              <Switch
                value={field.state.value}
                onValueChange={field.handleChange}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor="#fff"
              />
            </View>
          )}
        </form.Field>
      </View>

      {/* BUTTON ROW */}
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
          onPress={onCancel}
          disabled={isSubmitting}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.saveButton, { backgroundColor: theme.accent }]}
          onPress={() => form.handleSubmit()}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[styles.buttonText, styles.saveButtonText]}>Save Card</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    marginTop: 10,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  form: {
    marginTop: 12,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  switchSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  errorBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
    gap: 16,
  },
  button: {
    flex: 1,
    minHeight: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  saveButtonText: {
    color: '#fff',
  },
});
