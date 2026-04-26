import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface Props {
  uri?: string;
  name?: string;
  size?: number;
}

export function Avatar({ uri, name, size = 48 }: Props) {
  const initials = name
    ? name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "?";

  if (uri) {
    return <Image source={{ uri }} style={[styles.img, { width: size, height: size, borderRadius: size / 2 }]} />;
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  img: { backgroundColor: "#E5E7EB" },
  fallback: { backgroundColor: "#2563EB", alignItems: "center", justifyContent: "center" },
  initials: { color: "#fff", fontWeight: "700" },
});
