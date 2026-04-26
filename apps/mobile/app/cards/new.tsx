import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { TextInput } from "../../src/components/ui/TextInput";
import { Button } from "../../src/components/ui/Button";
import { CardRenderer } from "../../src/components/cards/CardRenderer";
import { createCard, getAvatarUploadUrl, uploadAvatar } from "../../src/api/cards";

type TemplateId = "classic" | "dark" | "minimal";

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "dark", label: "Dark" },
  { id: "minimal", label: "Minimal" },
];

export default function NewCard() {
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [fields, setFields] = useState({
    name: "", title: "", company: "", email: "", phone: "", website: "", bio: "", avatarUrl: "",
  });

  const set = (key: keyof typeof fields) => (val: string) => setFields((f) => ({ ...f, [key]: val }));

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (result.canceled) return;
    const asset = result.assets[0];
    const ext = asset.uri.split(".").pop() ?? "jpg";
    try {
      const { uploadUrl, publicUrl } = await getAvatarUploadUrl(ext);
      await uploadAvatar(uploadUrl, asset.uri, ext);
      set("avatarUrl")(publicUrl);
    } catch {
      Alert.alert("Failed to upload photo");
    }
  };

  const handleSave = async () => {
    if (!fields.name.trim()) { Alert.alert("Name is required"); return; }
    setLoading(true);
    try {
      await createCard({ templateId, isDefault, fields: { ...fields, name: fields.name.trim() } });
      router.back();
    } catch (e: any) {
      Alert.alert("Failed to save", e?.response?.data?.error ?? e?.message);
    } finally {
      setLoading(false);
    }
  };

  if (previewMode) {
    return (
      <View style={styles.preview}>
        <CardRenderer templateId={templateId} fields={fields} />
        <Button title="Back to Edit" variant="ghost" onPress={() => setPreviewMode(false)} style={styles.backBtn} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.section}>Template</Text>
      <View style={styles.templates}>
        {TEMPLATES.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.templateBtn, templateId === t.id && styles.templateBtnActive]}
            onPress={() => setTemplateId(t.id)}
          >
            <Text style={[styles.templateLabel, templateId === t.id && styles.templateLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.section}>Details</Text>
      <TextInput label="Name *" value={fields.name} onChangeText={set("name")} placeholder="Your full name" />
      <TextInput label="Title" value={fields.title} onChangeText={set("title")} placeholder="e.g. Product Manager" />
      <TextInput label="Company" value={fields.company} onChangeText={set("company")} placeholder="e.g. Acme Corp" />
      <TextInput label="Email" value={fields.email} onChangeText={set("email")} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
      <TextInput label="Phone" value={fields.phone} onChangeText={set("phone")} placeholder="+1 555 0100" keyboardType="phone-pad" />
      <TextInput label="Website" value={fields.website} onChangeText={set("website")} placeholder="https://example.com" autoCapitalize="none" />
      <TextInput label="Bio" value={fields.bio} onChangeText={set("bio")} placeholder="A short intro..." multiline numberOfLines={3} style={{ height: 80 }} />

      <Button title="Add Photo" variant="ghost" onPress={pickAvatar} style={styles.photoBtn} />
      {fields.avatarUrl ? <Text style={styles.photoSet}>Photo uploaded ✓</Text> : null}

      <View style={styles.defaultRow}>
        <Text style={styles.defaultLabel}>Set as default card</Text>
        <Switch value={isDefault} onValueChange={setIsDefault} trackColor={{ true: "#2563EB" }} />
      </View>

      <Button title="Preview" variant="ghost" onPress={() => setPreviewMode(true)} style={styles.previewBtn} />
      <Button title="Save Card" onPress={handleSave} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { padding: 20, paddingBottom: 40 },
  section: { fontSize: 13, fontWeight: "700", color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 8 },
  templates: { flexDirection: "row", gap: 10, marginBottom: 20 },
  templateBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: "#E5E7EB", alignItems: "center", backgroundColor: "#fff" },
  templateBtnActive: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  templateLabel: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  templateLabelActive: { color: "#2563EB" },
  photoBtn: { marginBottom: 4 },
  photoSet: { fontSize: 13, color: "#10B981", textAlign: "center", marginBottom: 16 },
  defaultRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  defaultLabel: { fontSize: 15, color: "#111827" },
  previewBtn: { marginBottom: 10 },
  preview: { flex: 1, padding: 20, backgroundColor: "#F9FAFB", justifyContent: "center" },
  backBtn: { marginTop: 24 },
});
