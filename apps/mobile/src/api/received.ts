import { api } from "./client";

export interface ReceivedCard {
  sk: string;
  source: "p2p" | "group";
  fromUserId: string;
  cardSnapshot: any;
  receivedAt: string;
  sessionId?: string;
}

export async function listReceived(): Promise<ReceivedCard[]> {
  const { data } = await api.get("/received");
  return data.received;
}
