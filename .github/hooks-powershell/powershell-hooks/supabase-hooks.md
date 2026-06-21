# Skill: supabase-hooks

**Triggers:** Touching any file in `src/hooks/`, `src/lib/supabase.ts`, `src/integrations/supabase/`, or auth/data loading issues.

---

## Hook Architecture

All data fetching goes through TanStack Query hooks in `src/hooks/`. Components never call Supabase directly.

```
Component → useXxx() hook → TanStack Query → src/lib/api.ts → Supabase client
```

---

## Hook Template

```ts
// src/hooks/useXxx.ts
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { fetchXxx } from '@/lib/api'

export function useXxx(userId: string) {
  return useQuery({
    queryKey: queryKeys.xxx(userId),
    queryFn: () => fetchXxx(userId),
    enabled: !!userId,   // don't run if no userId
    staleTime: 1000 * 60 * 5,  // 5 min cache
  })
}
```

## Mutation Template

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'

export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(notificationId),
    onSuccess: (_, notificationId) => {
      // Invalidate so the list refreshes
      qc.invalidateQueries({ queryKey: queryKeys.notifications() })
    },
  })
}
```

---

## Supabase Client

```ts
// src/lib/supabase.ts — always import from here
import { supabase } from '@/lib/supabase'

// Fetch example
const { data, error } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })

if (error) throw error
return data
```

---

## Auth Pattern

```ts
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  return { session, loading, user: session?.user ?? null }
}
```

---

## Query Key Registry

Every hook's `queryKey` must be registered in `src/lib/queryKeys.ts`:

```ts
export const queryKeys = {
  member: (userId: string) => ['member', userId] as const,
  notifications: (userId?: string) => userId ? ['notifications', userId] : ['notifications'],
  history: (userId: string) => ['history', userId] as const,
  upgrade: () => ['upgrade'] as const,
}
```

---

## Error Handling in Hooks

```ts
export function useMember(userId: string) {
  return useQuery({
    queryKey: queryKeys.member(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!userId,
  })
}
```

In the component:
```tsx
const { data, isLoading, error } = useMember(userId)
if (isLoading) return <Skeleton className="h-20 w-full" />
if (error) return <Alert><AlertDescription>{error.message}</AlertDescription></Alert>
```
