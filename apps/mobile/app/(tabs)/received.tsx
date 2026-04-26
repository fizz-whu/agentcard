import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReceivedCardItem } from "../../src/components/sessions/ReceivedCardItem";
import { LoadingOverlay } from "../../src/components/ui/LoadingOverlay";
import { listReceived, ReceivedCard } from "../../src/api/received";

export default function ReceivedTab() {
  const [received, setReceived] = useState<ReceivedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await listReceived();
      setReceived(data);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) return <LoadingOverlay />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.heading}>Received Cards</Text>
        <Text style={styles.sub}>{received.length} card{received.length !== 1 ? "s" : ""} collected</Text>

        {received.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No cards yet</Text>
            <Text style={styles.emptySub}>Exchange cards with others using the Scan tab</Text>
          </View>
        )}

        {received.map((item) => (
          <ReceivedCardItem
            key={item.sk}
            card={item.cardSnapshot}
            receivedAt={item.receivedAt}
            source={item.source}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 26, fontWeight: "800", color: "#111827", marginBottom: 4 },
  sub: { fontSize: 14, color: "#6B7280", marginBottom: 20 },
  empty: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 8 },
  emptySub: { fontSize: 14, color: "#6B7280", textAlign: "center" },
});
