import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = "primary", loading, disabled, style }: Props) {
  const bg = variant === "primary" ? "#2563EB"
    : variant === "secondary" ? "#10B981"
    : variant === "danger" ? "#EF4444"
    : "transparent";

  const textColor = variant === "ghost" ? "#2563EB" : "#fff";
  const borderColor = variant === "ghost" ? "#2563EB" : "transparent";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.base, { backgroundColor: bg, borderColor, borderWidth: variant === "ghost" ? 1.5 : 0, opacity: disabled ? 0.5 : 1 }, style]}
    >
      {loading
        ? <ActivityIndicator color={textColor} />
        : <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  text: { fontSize: 16, fontWeight: "600" },
});
