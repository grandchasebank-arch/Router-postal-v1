import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications(),
    queryFn: api.getNotifications,
  });
}

export function useNotificationById(id: string) {
  return useQuery({
    queryKey: ["notification", id],
    queryFn: () => api.getNotificationById(id),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.markAllNotificationsRead,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.notifications() }),
  });
}
