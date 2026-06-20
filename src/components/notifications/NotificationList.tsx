import type { AppNotification } from "@/types/notification";
import { NotificationItem } from "./NotificationItem";

export function NotificationList({ items }: { items: AppNotification[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)]">
        No notifications yet.
      </div>
    );
  }
  return (
    <div className="mb-8 flex flex-col gap-2">
      {items.map((n) => (
        <NotificationItem key={n.id} n={n} />
      ))}
    </div>
  );
}
