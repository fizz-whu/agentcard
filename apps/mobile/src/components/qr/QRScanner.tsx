import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

interface Props {
  onScan: (data: string) => void;
}

export function QRScanner({ onScan }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View style={styles.center} />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>Camera access is needed to scan QR codes</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={scanned ? undefined : ({ data }) => {
          setScanned(true);
          onScan(data);
        }}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      <View style={styles.overlay}>
        <View style={styles.cutout} />
      </View>
      {scanned && (
        <TouchableOpacity style={styles.rescan} onPress={() => setScanned(false)}>
          <Text style={styles.rescanText}>Tap to scan again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  cutout: { width: 240, height: 240, borderRadius: 16, borderWidth: 3, borderColor: "#fff", backgroundColor: "transparent" },
  permText: { fontSize: 16, color: "#374151", textAlign: "center", marginBottom: 16 },
  btn: { backgroundColor: "#2563EB", borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12 },
  btnText: { color: "#fff", fontWeight: "600" },
  rescan: { position: "absolute", bottom: 48, alignSelf: "center", backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10 },
  rescanText: { color: "#fff", fontWeight: "600" },
});
