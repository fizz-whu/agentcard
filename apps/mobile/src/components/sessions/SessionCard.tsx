import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { formatTimeLeft, isExpired } from "../../utils/time";

interface Props {
  session: { id: string; title?: string; expiresAt: string; status: string };
  memberCount?: number;
  onPress: () => void;
}

export function SessionCard({ session, memberCount, onPress }: Props) {
  const expired = isExpired(session.expiresAt) || session.status === "closed";
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: expired ? "#9CA3AF" : "#10B981" }]} />
        <Text style={styles.title} numberOfLines={1}>{session.title ?? "Group Exchange"}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.time}>{expired ? "Closed" : formatTimeLeft(session.expiresAt)}</Text>
        {memberCount != null && <Text style={styles.members}>{memberCount} members</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 10, elevation: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  title: { fontSize: 16, fontWeight: "600", color: "#111827", flex: 1 },
  meta: { flexDirection: "row", justifyContent: "space-between" },
  time: { fontSize: 13, color: "#6B7280" },
  members: { fontSize: 13, color: "#6B7280" },
});
