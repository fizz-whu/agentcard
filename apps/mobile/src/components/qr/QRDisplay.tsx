import React from "react";
import { View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

interface Props {
  value: string;
  size?: number;
}

export function QRDisplay({ value, size = 220 }: Props) {
  return (
    <View style={[styles.container, { padding: 16 }]}>
      <QRCode value={value} size={size} color="#111827" backgroundColor="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", borderRadius: 16, alignSelf: "center", elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
});
