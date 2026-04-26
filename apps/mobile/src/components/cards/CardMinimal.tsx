import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { CardFields } from "@agentcard/shared";

export function CardMinimal({ fields }: { fields: CardFields }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{fields.name}</Text>
      {(fields.title || fields.company) && (
        <Text style={styles.role}>
          {[fields.title, fields.company].filter(Boolean).join(" · ")}
        </Text>
      )}
      <View style={styles.contacts}>
        {fields.email && <Text style={styles.contact}>{fields.email}</Text>}
        {fields.phone && <Text style={styles.contact}>{fields.phone}</Text>}
        {fields.website && <Text style={styles.contact}>{fields.website}</Text>}
      </View>
      {fields.bio && <Text style={styles.bio}>{fields.bio}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FAFAFA", borderRadius: 14, padding: 24, borderWidth: 1, borderColor: "#E5E7EB" },
  name: { fontSize: 26, fontWeight: "800", color: "#111827", letterSpacing: -0.5 },
  role: { fontSize: 13, color: "#6B7280", marginTop: 4, letterSpacing: 0.5, textTransform: "uppercase" },
  contacts: { marginTop: 16, gap: 4 },
  contact: { fontSize: 13, color: "#374151" },
  bio: { fontSize: 12, color: "#9CA3AF", marginTop: 12, lineHeight: 18 },
});
