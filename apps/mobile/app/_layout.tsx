import "react-native-get-random-values";
import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/auth/AuthContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="cards/new" options={{ headerShown: true, title: "New Card", presentation: "modal" }} />
            <Stack.Screen name="cards/[id]" options={{ headerShown: true, title: "Edit Card", presentation: "modal" }} />
            <Stack.Screen name="sessions/new" options={{ headerShown: true, title: "New Session", presentation: "modal" }} />
            <Stack.Screen name="sessions/[id]" options={{ headerShown: true, title: "Group Session" }} />
          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
