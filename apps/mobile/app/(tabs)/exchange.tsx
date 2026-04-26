import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { QRScanner } from "../../src/components/qr/QRScanner";
import { CardRenderer } from "../../src/components/cards/CardRenderer";
import { Button } from "../../src/components/ui/Button";
import { LoadingOverlay } from "../../src/components/ui/LoadingOverlay";
import { decodeQRPayload } from "../../src/utils/qr";
import { submitP2PExchange } from "../../src/api/exchange";
import { joinSession } from "../../src/api/sessions";
import { isExpired } from "../../src/utils/time";

export default function ExchangeTab() {
  const [exchanging, setExchanging] = useState(false);
  const [receivedCard, setReceivedCard] = useState<any>(null);

  const handleScan = async (raw: string) => {
    const payload = decodeQRPayload(raw);
    if (!payload) { Alert.alert("Invalid QR code"); return; }

    setExchanging(true);
    try {
      if (payload.t === "c") {
        const card = await submitP2PExchange(payload.uid, payload.cid);
        setReceivedCard(card);
      } else if (payload.t === "s") {
        if (isExpired(new Date(payload.exp * 1000).toISOString())) {
          Alert.alert("Session expired", "This group session has already ended.");
          return;
        }
        await joinSession(payload.sid);
        router.push(`/sessions/${payload.sid}`);
      }
    } catch (e: any) {
      Alert.alert("Exchange failed", e?.response?.data?.error ?? e?.message ?? "Please try again");
    } finally {
      setExchanging(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.heading}>Scan QR Code</Text>
        <Text style={styles.sub}>Scan someone's card or a group session QR</Text>
      </View>

      <View style={styles.scanner}>
        {exchanging ? <LoadingOverlay /> : <QRScanner onScan={handleScan} />}
      </View>

      <Modal visible={!!receivedCard} animationType="slide" transparent>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Card Received!</Text>
            {receivedCard && (
              <CardRenderer templateId={receivedCard.templateId} fields={receivedCard.fields} />
            )}
            <Button title="Done" onPress={() => setReceivedCard(null)} style={styles.modalBtn} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#111827" },
  header: { padding: 20, paddingBottom: 12 },
  heading: { fontSize: 22, fontWeight: "800", color: "#fff" },
  sub: { fontSize: 13, color: "#9CA3AF", marginTop: 4 },
  scanner: { flex: 1 },
  modal: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#F9FAFB", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 16, textAlign: "center" },
  modalBtn: { marginTop: 20 },
});
