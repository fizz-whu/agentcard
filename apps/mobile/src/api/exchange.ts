import { api } from "./client";
import type { NameCard } from "@agentcard/shared";

export async function submitP2PExchange(fromUserId: string, cardId: string): Promise<NameCard> {
  const { data } = await api.post("/exchange/p2p", { fromUserId, cardId });
  return data.card;
}
