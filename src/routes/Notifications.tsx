import { Loader } from '@/components/shared/Loader'
import { NotificationList } from '@/components/notifications/NotificationList'
import { useMarkAllRead, useNotifications } from '@/hooks/useNotifications'

export default function Notifications() {
  const { data, isLoading } = useNotifications()
  const markAll = useMarkAllRead()

  return (
    <>
      <div className="mb-6 animate-slide-up">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-1 text-[28px] font-semibold tracking-[-0.02em]">
              Notifications
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Latest activity from your portal
            </p>
          </div>
          <button
            type="button"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
            className="rounded-[10px] border border-[var(--border-bright)] bg-transparent px-4 py-2 text-xs font-semibold text-[var(--muted)] transition hover:border-white/20 hover:text-[var(--text)]"
          >
            Mark all read
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center pt-12">
          <Loader size={24} />
        </div>
      ) : (
        <NotificationList items={data ?? []} />
      )}
    </>
  )
}
