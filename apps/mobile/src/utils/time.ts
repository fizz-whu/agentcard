export function isExpired(isoDate: string): boolean {
  return new Date(isoDate) < new Date();
}

export function formatTimeLeft(isoDate: string): string {
  const ms = new Date(isoDate).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const mins = Math.floor(ms / 60000);
  const hours = Math.floor(mins / 60);
  if (hours > 0) return `${hours}h ${mins % 60}m left`;
  return `${mins}m left`;
}

export function formatRelativeTime(isoDate: string): string {
  const ms = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(ms / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}
