# Skill: debugging

**Triggers:** Runtime errors, broken components, blank pages, TypeScript errors, import failures.

---

## Triage Order

1. Read the error. Categorize: import error / prop type error / runtime crash / style break.
2. Run TypeScript check: `npx tsc --noEmit`
3. Run the audit hook: `script .github/hooks/audit-ui.ps1`
4. Fix ONE file at a time. Re-run `tsc --noEmit` after each fix.

---

## Common Errors & Fixes

### "Cannot find module '@/components/ui/xxx'"

The shadcn component isn't installed.

```bash
# Add it
npx shadcn@latest add <component-name>
```

### "Module not found: @/lib/utils"

Check `src/lib/utils.ts` exists and exports `cn`:

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Blank page (no error in console)

Usually a router issue. Check `src/App.tsx` — the route path and the component import.

```tsx
// Verify all routes in App.tsx have matching component files
import { Dashboard } from "./routes/Dashboard"
// route: <Route path="/" element={<Dashboard />} />
```

### "useNavigate() may be used only in context of <Router>"

A component using `useNavigate` or `useParams` is rendered outside the Router. Check `src/main.tsx` wraps everything in `<BrowserRouter>`.

### "Cannot read properties of undefined (reading 'xxx')"

Usually data is undefined before the query loads. Add a loading guard:

```tsx
const { data, isLoading } = useMember()
if (isLoading) return <Skeleton className="h-20 w-full" />
if (!data) return null
// now safe to use data.xxx
```

### Tailwind classes not applying

1. Check the class name is a valid Tailwind utility (v4 uses `@theme` config).
2. Check `src/styles.css` has `@import "tailwindcss"`.
3. Check `vite.config.ts` includes the right content paths.
4. Don't build class names dynamically: `"text-" + color` — Tailwind can't detect these.

### Dark mode broken

Theme is controlled by `.light` class on `<html>`. Default = dark.

```ts
// src/hooks/useTheme.ts controls this
// localStorage key: 'spacex_theme'
// value: 'light' → adds .light class, otherwise dark
```

Use only CSS variable-based classes: `bg-background`, `text-foreground`, etc.

### Sheet/Dialog not opening

Must be controlled with state:

```tsx
const [open, setOpen] = useState(false)
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent>...</SheetContent>
</Sheet>
// Trigger: <Button onClick={() => setOpen(true)}>Open</Button>
```

Missing `open` prop = uncontrolled, often won't respond to triggers.

### TanStack Query data not refreshing

Check the query key in `src/lib/queryKeys.ts` is specific enough. If two queries share the same key they'll share stale data.

```ts
// src/lib/queryKeys.ts
export const queryKeys = {
  member: (id: string) => ['member', id],
  notifications: (userId: string) => ['notifications', userId],
  history: (userId: string) => ['history', userId],
}
```

---

## Debug Output Helpers

```tsx
// Temporary — remove before committing
console.log('[DEBUG ComponentName]', { data, isLoading, error })

// In JSX for visual inspection
{process.env.NODE_ENV === 'development' && (
  <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
)}
```

---

## Supabase Auth Debug

```ts
// Check current session
import { supabase } from "@/lib/supabase"
const { data: { session } } = await supabase.auth.getSession()
console.log('session:', session)
```

If session is null, the user isn't logged in. Check `src/hooks/useAuth.ts` handles the unauthenticated state.
