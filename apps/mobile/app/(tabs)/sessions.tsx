import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { SessionCard } from "../../src/components/sessions/SessionCard";
import { Button } from "../../src/components/ui/Button";
import { LoadingOverlay } from "../../src/components/ui/LoadingOverlay";
import { getSessionCards } from "../../src/api/sessions";
import { useAuth } from "../../src/auth/AuthContext";

interface SessionSummary {
  id: string;
  title?: string;
  expiresAt: string;
  status: string;
  hostUserId: string;
  memberCount: number;
}

export default function SessionsTab() {
  const { userId } = useAuth();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // In a real app you'd have GET /sessions. For now we track locally via state.
  // Sessions are added when user creates or joins one (via navigation state).
  // This is a placeholder showing the UI pattern.

  useFocusEffect(useCallback(() => {
    setLoading(false);
  }, []));

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Sessions</Text>
          <Button title="+ New" onPress={() => router.push("/sessions/new")} variant="primary" style={styles.newBtn} />
        </View>

        <Text style={styles.sectionTitle}>Active</Text>
        {sessions.filter((s) => s.status === "active").length === 0 && (
          <Text style={styles.empty}>No active sessions. Create one to start a group exchange.</Text>
        )}
        {sessions.filter((s) => s.status === "active").map((s) => (
          <SessionCard key={s.id} session={s} memberCount={s.memberCount} onPress={() => router.push(`/sessions/${s.id}`)} />
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Past</Text>
        {sessions.filter((s) => s.status === "closed").length === 0 && (
          <Text style={styles.empty}>No past sessions yet.</Text>
        )}
        {sessions.filter((s) => s.status === "closed").map((s) => (
          <SessionCard key={s.id} session={s} memberCount={s.memberCount} onPress={() => router.push(`/sessions/${s.id}`)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  heading: { fontSize: 26, fontWeight: "800", color: "#111827" },
  newBtn: { height: 38, paddingHorizontal: 14 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  empty: { fontSize: 14, color: "#9CA3AF", textAlign: "center", paddingVertical: 20 },
});
