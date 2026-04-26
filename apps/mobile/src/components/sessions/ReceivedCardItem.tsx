import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "../ui/Avatar";
import { formatRelativeTime } from "../../utils/time";

interface Props {
  card: { fields: { name: string; title?: string; company?: string; avatarUrl?: string } };
  receivedAt: string;
  source: "p2p" | "group";
  selected?: boolean;
  selectable?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
}

export function ReceivedCardItem({ card, receivedAt, source, selected, selectable, onToggle, onPress }: Props) {
  const { fields } = card;
  return (
    <TouchableOpacity style={[styles.container, selected && styles.selected]} onPress={selectable ? onToggle : onPress}>
      <Avatar uri={fields.avatarUrl} name={fields.name} size={44} />
      <View style={styles.info}>
        <Text style={styles.name}>{fields.name}</Text>
        <Text style={styles.sub}>{[fields.title, fields.company].filter(Boolean).join(" · ")}</Text>
        <Text style={styles.time}>{formatRelativeTime(receivedAt)} · {source === "p2p" ? "Direct" : "Group"}</Text>
      </View>
      {selectable && (
        <View style={[styles.check, selected && styles.checkSelected]}>
          {selected && <Text style={styles.checkMark}>✓</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 8, gap: 12, elevation: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  selected: { borderWidth: 2, borderColor: "#2563EB" },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "600", color: "#111827" },
  sub: { fontSize: 13, color: "#6B7280", marginTop: 1 },
  time: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  check: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#D1D5DB", alignItems: "center", justifyContent: "center" },
  checkSelected: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  checkMark: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
