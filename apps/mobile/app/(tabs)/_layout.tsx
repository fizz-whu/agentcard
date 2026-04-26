import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: { borderTopColor: "#E5E7EB", backgroundColor: "#fff" },
        headerStyle: { backgroundColor: "#fff" },
        headerTitleStyle: { fontWeight: "700", color: "#111827" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Card",
          tabBarIcon: ({ color, size }) => <Ionicons name="card-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="exchange"
        options={{
          title: "Exchange",
          tabBarIcon: ({ color, size }) => <Ionicons name="qr-code-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: "Sessions",
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="received"
        options={{
          title: "Received",
          tabBarIcon: ({ color, size }) => <Ionicons name="archive-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
