import { useState, useEffect, useCallback } from "react";
import { listCards } from "../api/cards";
import type { NameCard } from "@agentcard/shared";

export function useCards() {
  const [cards, setCards] = useState<NameCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listCards();
      setCards(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load cards");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const defaultCard = cards.find((c) => c.isDefault) ?? cards[0] ?? null;

  return { cards, defaultCard, loading, error, refetch: fetch };
}
