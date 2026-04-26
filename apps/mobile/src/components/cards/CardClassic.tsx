import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "../ui/Avatar";
import type { CardFields } from "@agentcard/shared";

export function CardClassic({ fields }: { fields: CardFields }) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.body}>
        <View style={styles.header}>
          <View style={styles.info}>
            <Text style={styles.name}>{fields.name}</Text>
            {fields.title && <Text style={styles.title}>{fields.title}</Text>}
            {fields.company && <Text style={styles.company}>{fields.company}</Text>}
          </View>
          <Avatar uri={fields.avatarUrl} name={fields.name} size={52} />
        </View>
        <View style={styles.divider} />
        <View style={styles.contacts}>
          {fields.email && <Text style={styles.contact}>{fields.email}</Text>}
          {fields.phone && <Text style={styles.contact}>{fields.phone}</Text>}
          {fields.website && <Text style={styles.contact}>{fields.website}</Text>}
        </View>
        {fields.bio && <Text style={styles.bio}>{fields.bio}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  accent: { width: 6, backgroundColor: "#2563EB" },
  body: { flex: 1, padding: 18 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  info: { flex: 1, marginRight: 12 },
  name: { fontSize: 20, fontWeight: "700", color: "#111827" },
  title: { fontSize: 14, color: "#4B5563", marginTop: 2 },
  company: { fontSize: 13, color: "#2563EB", marginTop: 2, fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 12 },
  contacts: { gap: 4 },
  contact: { fontSize: 13, color: "#6B7280" },
  bio: { fontSize: 12, color: "#9CA3AF", marginTop: 10, lineHeight: 18 },
});
