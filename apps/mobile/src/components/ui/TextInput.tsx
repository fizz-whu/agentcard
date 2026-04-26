import React from "react";
import { View, Text, TextInput as RNTextInput, StyleSheet, TextInputProps } from "react-native";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export function TextInput({ label, error, style, ...props }: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[styles.input, error ? styles.inputError : undefined, style]}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#fff",
  },
  inputError: { borderColor: "#EF4444" },
  error: { fontSize: 12, color: "#EF4444", marginTop: 4 },
});
