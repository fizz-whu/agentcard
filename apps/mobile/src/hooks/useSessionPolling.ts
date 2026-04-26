import { useState, useEffect, useRef } from "react";
import { getSessionCards } from "../api/sessions";
import { isExpired } from "../utils/time";

export function useSessionPolling(sessionId: string, intervalMs = 4000) {
  const [data, setData] = useState<Awaited<ReturnType<typeof getSessionCards>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOnce = async () => {
    try {
      const result = await getSessionCards(sessionId);
      setData(result);
      setError(null);

      const sessionClosed = result.session.status === "closed" || isExpired(result.session.expiresAt);
      if (sessionClosed && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to load session");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnce();
    intervalRef.current = setInterval(fetchOnce, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionId]);

  return { session: data?.session, members: data?.members ?? [], loading, error, refetch: fetchOnce };
}
