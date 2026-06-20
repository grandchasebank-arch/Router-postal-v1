import { useNavigate } from "react-router-dom";
import type { AppNotification } from "@/types/notification";
import { NotificationItem } from "./NotificationItem";

export function NotificationList({ items }: { items: AppNotification[] }) {
  const navigate = useNavigate();

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
        <button
          key={n.id}
          type="button"
          onClick={() => navigate(`/notifications/${n.id}`)}
          className="w-full text-left"
        >
          <NotificationItem n={n} />
        </button>
      ))}
    </div>
  );
}
