import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useNotificationById } from "@/hooks/useNotifications";
import { Loader } from "@/components/shared/Loader";
import {
  Bell,
  Award,
  TrendingUp,
  Zap,
  AlertCircle,
} from "lucide-react";

const NOTIFICATION_ICONS = {
  upgrade: Bell,
  badge: Award,
  profit: TrendingUp,
  event: Zap,
  system: AlertCircle,
};

export default function NotificationPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: notification, isLoading } = useNotificationById(id || "");

  // Mark as read when component mounts
  useEffect(() => {
    if (notification && notification.unread) {
      console.log("[v0] Marking notification as read:", id);
      // Note: In a real app, you'd call markAsRead(id) here
      // For now, the data structure has unread: boolean property
    }
  }, [notification, id]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--background)] flex justify-center pt-12">
        <Loader size={24} />
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--background)] flex flex-col items-center justify-center px-4">
        <p className="text-sm text-[var(--muted)]">Notification not found</p>
      </div>
    );
  }

  const IconComponent =
    NOTIFICATION_ICONS[notification.kind as keyof typeof NOTIFICATION_ICONS] || AlertCircle;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--background)] flex flex-col overflow-hidden">
      {/* Header with back button */}
      <div className="flex items-center gap-4 px-5 pt-5 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border-bright)] bg-[var(--surface)] text-[var(--text)] transition hover:opacity-80"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)]">
          <IconComponent size={24} />
          {notification.unread && (
            <div className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-[var(--background)]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="font-semibold text-[var(--text)] truncate">
            {notification.title}
          </h1>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--border)]" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <p className="text-sm leading-relaxed text-[var(--text)]">
          {notification.message}
        </p>
      </div>

      {/* Footer with timestamp */}
      <div className="border-t border-[var(--border)] px-5 py-4">
        <p className="text-xs text-[var(--muted)]">
          {notification.time}
        </p>
      </div>
    </div>
  );
}
