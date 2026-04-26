import { api } from "./client";
import type { NameCard, CardFields } from "@agentcard/shared";

export async function listCards(): Promise<NameCard[]> {
  const { data } = await api.get("/cards");
  return data.cards;
}

export async function createCard(body: {
  templateId: string;
  isDefault: boolean;
  fields: CardFields;
}): Promise<NameCard> {
  const { data } = await api.post("/cards", body);
  return data.card;
}

export async function updateCard(
  id: string,
  body: Partial<{ templateId: string; isDefault: boolean; fields: CardFields }>
): Promise<void> {
  await api.put(`/cards/${id}`, body);
}

export async function deleteCard(id: string): Promise<void> {
  await api.delete(`/cards/${id}`);
}

export async function getAvatarUploadUrl(ext: string): Promise<{ uploadUrl: string; publicUrl: string }> {
  const { data } = await api.get(`/cards/avatar-url?ext=${ext}`);
  return data;
}

export async function uploadAvatar(uploadUrl: string, uri: string, ext: string): Promise<void> {
  const contentType = ext === "png" ? "image/png" : "image/jpeg";
  const response = await fetch(uri);
  const blob = await response.blob();
  await fetch(uploadUrl, { method: "PUT", body: blob, headers: { "Content-Type": contentType } });
}
