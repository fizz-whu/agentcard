import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSessionPolling } from "../../src/hooks/useSessionPolling";
import { useAuth } from "../../src/auth/AuthContext";
import { QRDisplay } from "../../src/components/qr/QRDisplay";
import { CardRenderer } from "../../src/components/cards/CardRenderer";
import { ReceivedCardItem } from "../../src/components/sessions/ReceivedCardItem";
import { Button } from "../../src/components/ui/Button";
import { LoadingOverlay } from "../../src/components/ui/LoadingOverlay";
import { encodeSessionQR } from "../../src/utils/qr";
import { formatTimeLeft, isExpired } from "../../src/utils/time";
import { keepCards, closeSession } from "../../src/api/sessions";

export default function SessionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const { session, members, loading, error, refetch } = useSessionPolling(id);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [keeping, setKeeping] = useState(false);
  const [keepDone, setKeepDone] = useState(false);

  if (loading) return <LoadingOverlay />;
  if (error || !session) return (
    <View style={styles.center}><Text style={styles.error}>{error ?? "Session not found"}</Text></View>
  );

  const isHost = session.hostUserId === userId;
  const isClosed = session.status === "closed" || isExpired(session.expiresAt);
  const othersCards = members.filter((m) => m.userId !== userId);

  const toggleSelect = (uid: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      next.has(uid) ? next.delete(uid) : next.add(uid);
      return next;
    });
  };

  const selectAll = () => setSelectedUserIds(new Set(othersCards.map((m) => m.userId)));

  const handleKeep = async () => {
    setKeeping(true);
    try {
      await keepCards(id, [...selectedUserIds]);
      setKeepDone(true);
      Alert.alert("Saved!", `${selectedUserIds.size} card${selectedUserIds.size !== 1 ? "s" : ""} saved to Received.`);
    } catch (e: any) {
      Alert.alert("Failed to save", e?.message);
    } finally {
      setKeeping(false);
    }
  };

  const handleClose = () => {
    Alert.alert("Close session?", "No more members can join after this.", [
      { text: "Cancel" },
      { text: "Close", style: "destructive", onPress: async () => {
        await closeSession(id);
        refetch();
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{session.title ?? "Group Exchange"}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: isClosed ? "#9CA3AF" : "#10B981" }]} />
          <Text style={styles.statusText}>{isClosed ? "Closed" : formatTimeLeft(session.expiresAt)}</Text>
          <Text style={styles.memberCount}>{members.length} member{members.length !== 1 ? "s" : ""}</Text>
        </View>

        {!isClosed && isHost && (
          <View style={styles.qrSection}>
            <Text style={styles.sectionTitle}>Share QR Code</Text>
            <Text style={styles.qrSub}>Others scan this to join</Text>
            <QRDisplay value={encodeSessionQR(id, session.expiresAt)} />
            <Button title="Close Session" variant="danger" onPress={handleClose} style={styles.closeBtn} />
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {isClosed ? "Cards from this session" : "Cards collected so far"}
        </Text>

        {othersCards.length === 0 && (
          <Text style={styles.empty}>No members have joined yet</Text>
        )}

        {isClosed && !keepDone && othersCards.length > 0 && (
          <View style={styles.keepHeader}>
            <Text style={styles.keepHint}>Select cards to save to Received</Text>
            <TouchableOpacity onPress={selectAll}>
              <Text style={styles.selectAll}>Select All</Text>
            </TouchableOpacity>
          </View>
        )}

        {othersCards.map((m) => (
          <ReceivedCardItem
            key={m.userId}
            card={m.card}
            receivedAt={m.joinedAt}
            source="group"
            selectable={isClosed && !keepDone}
            selected={selectedUserIds.has(m.userId)}
            onToggle={() => toggleSelect(m.userId)}
          />
        ))}

        {isClosed && !keepDone && othersCards.length > 0 && (
          <Button
            title={`Save ${selectedUserIds.size} Card${selectedUserIds.size !== 1 ? "s" : ""}`}
            onPress={handleKeep}
            loading={keeping}
            disabled={selectedUserIds.size === 0}
            style={styles.keepBtn}
          />
        )}

        {keepDone && (
          <View style={styles.done}>
            <Text style={styles.doneText}>Cards saved to your Received tab ✓</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: "#EF4444", fontSize: 16 },
  title: { fontSize: 24, fontWeight: "800", color: "#111827", marginBottom: 8 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 14, color: "#374151", fontWeight: "600" },
  memberCount: { fontSize: 14, color: "#6B7280", marginLeft: "auto" },
  qrSection: { alignItems: "center", marginBottom: 28 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 8 },
  qrSub: { fontSize: 13, color: "#6B7280", marginBottom: 16 },
  closeBtn: { marginTop: 16, width: 200 },
  empty: { fontSize: 14, color: "#9CA3AF", textAlign: "center", paddingVertical: 20 },
  keepHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  keepHint: { fontSize: 14, color: "#374151" },
  selectAll: { fontSize: 14, color: "#2563EB", fontWeight: "600" },
  keepBtn: { marginTop: 16 },
  done: { backgroundColor: "#ECFDF5", borderRadius: 10, padding: 16, marginTop: 12 },
  doneText: { fontSize: 14, color: "#065F46", textAlign: "center", fontWeight: "600" },
});
