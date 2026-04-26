import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "../ui/Avatar";
import type { CardFields } from "@agentcard/shared";

export function CardDark({ fields }: { fields: CardFields }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar uri={fields.avatarUrl} name={fields.name} size={56} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{fields.name}</Text>
          {fields.title && <Text style={styles.title}>{fields.title}</Text>}
          {fields.company && <Text style={styles.company}>{fields.company}</Text>}
        </View>
      </View>
      <View style={styles.divider} />
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
  card: { backgroundColor: "#1a1a2e", borderRadius: 14, padding: 20, elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  header: { flexDirection: "row", alignItems: "center", gap: 14 },
  headerText: { flex: 1 },
  name: { fontSize: 20, fontWeight: "700", color: "#EEB84A" },
  title: { fontSize: 14, color: "#D1D5DB", marginTop: 2 },
  company: { fontSize: 13, color: "#9CA3AF", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#374151", marginVertical: 14 },
  contacts: { gap: 5 },
  contact: { fontSize: 13, color: "#9CA3AF" },
  bio: { fontSize: 12, color: "#6B7280", marginTop: 10, lineHeight: 18 },
});
