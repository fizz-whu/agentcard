import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { TextInput } from "../../src/components/ui/TextInput";
import { Button } from "../../src/components/ui/Button";
import { createSession } from "../../src/api/sessions";

const DURATIONS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "2 hours", value: 120 },
  { label: "4 hours", value: 240 },
];

export default function NewSession() {
  const [title, setTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const { id } = await createSession({ title: title.trim() || undefined, durationMinutes });
      router.replace(`/sessions/${id}`);
    } catch (e: any) {
      Alert.alert("Failed to create session", e?.response?.data?.error ?? e?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.description}>
        Create a group exchange session. Anyone who scans the QR code during the active period will share their default card with the group.
      </Text>

      <TextInput label="Session Name (optional)" value={title} onChangeText={setTitle} placeholder="e.g. Startup Meetup 2026" />

      <Text style={styles.durationLabel}>Duration</Text>
      <View style={styles.durations}>
        {DURATIONS.map((d) => (
          <View
            key={d.value}
            style={[styles.durationBtn, durationMinutes === d.value && styles.durationBtnActive]}
          >
            <Text
              style={[styles.durationText, durationMinutes === d.value && styles.durationTextActive]}
              onPress={() => setDurationMinutes(d.value)}
            >
              {d.label}
            </Text>
          </View>
        ))}
      </View>

      <Button title="Create Session" onPress={handleCreate} loading={loading} style={styles.btn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { padding: 20, paddingBottom: 40 },
  description: { fontSize: 14, color: "#6B7280", lineHeight: 20, marginBottom: 24 },
  durationLabel: { fontSize: 13, fontWeight: "700", color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  durations: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 28 },
  durationBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: "#E5E7EB", backgroundColor: "#fff" },
  durationBtnActive: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  durationText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  durationTextActive: { color: "#2563EB" },
  btn: { marginTop: 8 },
});
