import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCards } from "../../src/hooks/useCards";
import { useAuth } from "../../src/auth/AuthContext";
import { CardRenderer } from "../../src/components/cards/CardRenderer";
import { QRDisplay } from "../../src/components/qr/QRDisplay";
import { Button } from "../../src/components/ui/Button";
import { LoadingOverlay } from "../../src/components/ui/LoadingOverlay";
import { encodeCardQR } from "../../src/utils/qr";

export default function MyCardTab() {
  const { cards, defaultCard, loading, refetch } = useCards();
  const { userId, signOut } = useAuth();

  if (loading) return <LoadingOverlay />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.heading}>My Card</Text>
          <TouchableOpacity onPress={() => Alert.alert("Sign out?", "", [
            { text: "Cancel" },
            { text: "Sign out", style: "destructive", onPress: signOut },
          ])}>
            <Text style={styles.signOut}>Sign out</Text>
          </TouchableOpacity>
        </View>

        {defaultCard ? (
          <>
            <CardRenderer templateId={defaultCard.templateId} fields={defaultCard.fields} />

            <View style={styles.qrSection}>
              <Text style={styles.qrLabel}>Your QR Code</Text>
              <Text style={styles.qrSub}>Others scan this to exchange cards with you</Text>
              <QRDisplay value={encodeCardQR(userId!, defaultCard.id)} />
            </View>

            <View style={styles.actions}>
              <Button title="Edit Card" variant="ghost" onPress={() => router.push(`/cards/${defaultCard.id}`)} style={{ flex: 1 }} />
              <Button title="New Card" variant="secondary" onPress={() => router.push("/cards/new")} style={{ flex: 1 }} />
            </View>
          </>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No card yet</Text>
            <Text style={styles.emptySub}>Create your first name card to start exchanging</Text>
            <Button title="Create Card" onPress={() => router.push("/cards/new")} style={styles.emptyBtn} />
          </View>
        )}

        {cards.length > 1 && (
          <View style={styles.otherCards}>
            <Text style={styles.sectionTitle}>All Cards</Text>
            {cards.map((card) => (
              <TouchableOpacity key={card.id} style={styles.cardRow} onPress={() => router.push(`/cards/${card.id}`)}>
                <Text style={styles.cardName}>{card.fields.name}</Text>
                {card.isDefault && <View style={styles.badge}><Text style={styles.badgeText}>Default</Text></View>}
                <Text style={styles.cardTemplate}>{card.templateId}</Text>
              </TouchableOpacity>
            ))}
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  heading: { fontSize: 26, fontWeight: "800", color: "#111827" },
  signOut: { fontSize: 14, color: "#EF4444" },
  qrSection: { alignItems: "center", marginTop: 28, marginBottom: 24 },
  qrLabel: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 4 },
  qrSub: { fontSize: 13, color: "#6B7280", marginBottom: 16, textAlign: "center" },
  actions: { flexDirection: "row", gap: 12, marginBottom: 24 },
  empty: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 8 },
  emptySub: { fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 24 },
  emptyBtn: { width: 200 },
  otherCards: { marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 10 },
  cardRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 8, gap: 8 },
  cardName: { flex: 1, fontSize: 15, fontWeight: "600", color: "#111827" },
  badge: { backgroundColor: "#DBEAFE", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 12, color: "#2563EB", fontWeight: "600" },
  cardTemplate: { fontSize: 12, color: "#9CA3AF", textTransform: "capitalize" },
});
