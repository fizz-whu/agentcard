import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../../src/auth/AuthContext";
import { TextInput } from "../../src/components/ui/TextInput";
import { Button } from "../../src/components/ui/Button";

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) { Alert.alert("Please fill in all fields"); return; }
    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
    } catch (e: any) {
      Alert.alert("Sign in failed", e?.message ?? "Please check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>AgentCard</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>Sign in to your account</Text>

        <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" />

        <Button title="Sign In" onPress={handleSignIn} loading={loading} style={styles.btn} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/sign-up" style={styles.link}>Sign up</Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 24, backgroundColor: "#F9FAFB" },
  logo: { fontSize: 28, fontWeight: "800", color: "#2563EB", marginBottom: 32, textAlign: "center" },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 6 },
  sub: { fontSize: 15, color: "#6B7280", marginBottom: 28 },
  btn: { marginTop: 8 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#6B7280" },
  link: { color: "#2563EB", fontWeight: "600" },
});
