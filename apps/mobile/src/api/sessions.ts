import { api } from "./client";
import type { GroupSession } from "@agentcard/shared";

export async function createSession(body: {
  title?: string;
  durationMinutes: number;
}): Promise<{ id: string; expiresAt: string }> {
  const { data } = await api.post("/sessions", body);
  return data.session;
}

export async function joinSession(sessionId: string): Promise<{ session: GroupSession }> {
  const { data } = await api.post(`/sessions/${sessionId}/join`);
  return data;
}

export async function getSessionCards(sessionId: string): Promise<{
  session: GroupSession;
  members: { userId: string; card: any; joinedAt: string; kept: boolean }[];
}> {
  const { data } = await api.get(`/sessions/${sessionId}/cards`);
  return data;
}

export async function keepCards(sessionId: string, keptCardUserIds: string[]): Promise<void> {
  await api.post(`/sessions/${sessionId}/keep`, { keptCardUserIds });
}

export async function closeSession(sessionId: string): Promise<void> {
  await api.post(`/sessions/${sessionId}/close`);
}
