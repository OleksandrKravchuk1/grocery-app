import { useTheme } from '@/src/constants/theme';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  field?: any; // TanStack Field Api (optional)
  onChangeTextFormatter?: (val: string) => string;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
  rightElement?: React.ReactNode;
}

export function FormInput({
  label,
  field,
  onFocus,
  onBlur,
  onChangeTextFormatter,
  containerStyle,
  placeholder,
  error,
  rightElement,
  value,
  onChangeText,
  ...textInputProps
}: FormInputProps) {
  const theme = useTheme();

  // Determine values/handlers from either field or individual props
  const inputValue = field ? field.state.value : value;
  const errorText = field
    ? (field.state.meta.isTouched && field.state.meta.errors.length > 0 ? String(field.state.meta.errors[0]) : undefined)
    : error;

  const handleTextChange = (val: string) => {
    const formatted = onChangeTextFormatter ? onChangeTextFormatter(val) : val;
    if (field) {
      field.handleChange(formatted);
    } else if (onChangeText) {
      onChangeText(formatted);
    }
  };

  const handleBlur = (e: any) => {
    if (field) {
      field.handleBlur();
    }
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <View style={[styles.inputGroup, containerStyle]}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder={placeholder}
          placeholderTextColor={theme.muted}
          value={inputValue}
          onChangeText={handleTextChange}
          onFocus={onFocus}
          onBlur={handleBlur}
          {...textInputProps}
        />
        {rightElement}
      </View>
      {errorText ? (
        <Text style={[styles.fieldErrorText, { color: theme.danger }]}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  fieldErrorText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4,
  },
});
