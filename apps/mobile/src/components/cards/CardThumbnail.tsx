import React from "react";
import { View, StyleSheet } from "react-native";
import type { CardFields } from "@agentcard/shared";
import { CardRenderer } from "./CardRenderer";

interface Props {
  templateId: string;
  fields: CardFields;
}

export function CardThumbnail({ templateId, fields }: Props) {
  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={styles.scaled}>
        <CardRenderer templateId={templateId} fields={fields} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: 160, height: 90, overflow: "hidden", borderRadius: 8 },
  scaled: { transform: [{ scale: 0.44 }], transformOrigin: "top left", width: 364 },
});
