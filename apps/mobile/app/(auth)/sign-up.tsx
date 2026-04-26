import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "../../src/auth/AuthContext";
import { TextInput } from "../../src/components/ui/TextInput";
import { Button } from "../../src/components/ui/Button";

type Step = "register" | "confirm";

export default function SignUp() {
  const { signUp, confirmSignUp, signIn } = useAuth();
  const [step, setStep] = useState<Step>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) { Alert.alert("Please fill in all fields"); return; }
    if (password.length < 8) { Alert.alert("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      await signUp(email.trim().toLowerCase(), password);
      setStep("confirm");
    } catch (e: any) {
      Alert.alert("Sign up failed", e?.message ?? "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!code) { Alert.alert("Enter the verification code"); return; }
    setLoading(true);
    try {
      await confirmSignUp(email.trim().toLowerCase(), code.trim());
      await signIn(email.trim().toLowerCase(), password);
    } catch (e: any) {
      Alert.alert("Confirmation failed", e?.message ?? "Check the code and try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>AgentCard</Text>

        {step === "register" ? (
          <>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.sub}>Start exchanging cards</Text>
            <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
            <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" />
            <Button title="Create Account" onPress={handleSignUp} loading={loading} style={styles.btn} />
          </>
        ) : (
          <>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.sub}>We sent a verification code to {email}</Text>
            <TextInput label="Verification Code" value={code} onChangeText={setCode} keyboardType="number-pad" />
            <Button title="Verify & Continue" onPress={handleConfirm} loading={loading} style={styles.btn} />
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/sign-in" style={styles.link}>Sign in</Link>
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
