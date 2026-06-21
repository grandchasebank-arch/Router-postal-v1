# Portal Panel — Copilot Instructions

## Project Overview

SpaceX HQ Member Portal — React 19, Vite, React Router v6, TanStack Query v5, Tailwind CSS v4, shadcn/ui (Radix UI), Supabase.

---

## Skills

Skills are named guides that Copilot auto-triggers based on context. Read the skill for the task before writing code.

### Available Skills

| Skill | Trigger | Location |
|-------|---------|----------|
| `shadcn-component` | Any UI fix, component replacement, or broken layout | `.github/skills/shadcn-component.md` |
| `debugging` | Any runtime error, broken UI, or unexpected behavior | `.github/skills/debugging.md` |
| `testing` | Writing or running tests | `.github/skills/testing.md` |
| `frontend-design` | Redesigning or building new UI | `.github/skills/frontend-design.md` |
| `supabase-hooks` | Auth, data fetching, useAuth/useMember/useHistory hooks | `.github/skills/supabase-hooks.md` |

### How Skills Auto-Trigger

- Fixing a broken component → read `shadcn-component.md` first
- Seeing a runtime error → read `debugging.md` first
- Adding a new route or page → read `frontend-design.md` + `shadcn-component.md`
- Touching any hook file → read `supabase-hooks.md` first
- Writing test files → read `testing.md` first

---

## Hooks (Automation Scripts)

Hooks are shell scripts that run automatically at defined moments. If a hook doesn't exist, **create it** at the path listed.

### Hook Registry

```
.github/hooks/
├── pre-fix.sh          # Runs before any component edit — validates shadcn import paths
├── post-fix.sh         # Runs after edits — checks for broken imports and TypeScript errors
├── check-shadcn.sh     # Finds components using wrong import paths or non-shadcn UI
├── audit-ui.sh         # Lists all broken/missing UI components across the src/ tree
└── sync-types.sh       # Re-generates Supabase types from schema
```

### Hook: `pre-fix.sh`

```bash
#!/bin/bash
# Runs before fixing any component
# Checks: TypeScript errors, missing shadcn imports, broken paths

echo "🔍 Pre-fix audit..."
npx tsc --noEmit 2>&1 | head -40
echo "✅ Pre-fix done"
```

### Hook: `post-fix.sh`

```bash
#!/bin/bash
# Runs after any edit
# Checks: build still passes, no new TypeScript errors

echo "🔨 Post-fix build check..."
npx tsc --noEmit 2>&1 | head -40
echo "✅ Post-fix done"
```

### Hook: `check-shadcn.sh`

```bash
#!/bin/bash
# Finds components NOT imported from shadcn/ui paths
# Reports: wrong import sources, missing @/components/ui/ usage

echo "🔎 Scanning for non-shadcn UI component imports..."
grep -rn "from 'react'" src/components/ui/ --include="*.tsx" | grep -v "//.*from"
grep -rn "import.*Button\|import.*Card\|import.*Dialog\|import.*Sheet\|import.*Badge" src/ \
  --include="*.tsx" | grep -v "@/components/ui" | grep -v "node_modules"
echo "✅ shadcn check done"
```

### Hook: `audit-ui.sh`

```bash
#!/bin/bash
# Full UI audit — finds broken components, missing imports, layout issues
# Run this before starting any fix session

echo "📋 UI Audit Report"
echo "=================="

echo ""
echo "## TypeScript errors:"
npx tsc --noEmit 2>&1 | grep "error TS" | head -30

echo ""
echo "## Missing component imports:"
grep -rn "Cannot find module\|Module not found" src/ --include="*.tsx" 2>/dev/null | head -20

echo ""
echo "## Components importing from wrong path:"
grep -rn "from '.*shadcn\|from '.*radix-ui" src/ --include="*.tsx" | \
  grep -v "node_modules" | grep -v "@/components/ui"

echo ""
echo "## Files with TODO/FIXME:"
grep -rn "TODO\|FIXME\|BROKEN\|BUG" src/ --include="*.tsx" | head -20

echo "=================="
echo "✅ Audit complete"
```

### Hook: `sync-types.sh`

```bash
#!/bin/bash
# Re-generates Supabase TypeScript types
# Requires: SUPABASE_PROJECT_ID in environment

echo "🔄 Syncing Supabase types..."
if [ -z "$SUPABASE_PROJECT_ID" ]; then
  echo "⚠️  SUPABASE_PROJECT_ID not set — skipping type sync"
  exit 0
fi
npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" \
  > src/integrations/supabase/types.ts
echo "✅ Types synced"
```

---

## shadcn/ui Component Rules

### Import Path (ALWAYS use this)

```ts
// ✅ CORRECT — always import from @/components/ui/
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

// ❌ WRONG — never import directly from radix or shadcn packages
import { Button } from "shadcn/ui"
import { Button } from "@radix-ui/react-button"
```

### Component Search Protocol

When a UI element is broken or missing, Copilot MUST:

1. Run `ls src/components/ui/` to see what shadcn components are installed
2. Check if the right component exists before creating a custom one
3. If the component doesn't exist, run `npx shadcn@latest add <component-name>`
4. Import using `@/components/ui/<component-name>`
5. Never re-implement a component that shadcn already provides

### Components Available in This Project

```
accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb,
button, calendar, card, carousel, chart, checkbox, collapsible, command,
context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp,
input, label, menubar, navigation-menu, pagination, popover, progress,
radio-group, resizable, scroll-area, select, separator, sheet, sidebar,
skeleton, slider, sonner, switch, table, tabs, textarea, toggle-group,
toggle, tooltip
```

### Component → Use Case Mapping

| Broken UI Pattern | Use This shadcn Component |
|-------------------|--------------------------|
| Modal / overlay | `Dialog` or `Sheet` |
| Side panel / drawer | `Sheet` (already used in `NotificationSheet`) |
| List of notifications | `ScrollArea` + custom `NotificationItem` |
| Loading states | `Skeleton` |
| Progress bar | `Progress` |
| Status badges | `Badge` |
| User avatar | `Avatar` |
| Navigation tabs | `Tabs` or `BottomTabs` custom component |
| Confirmation prompt | `AlertDialog` |
| Dropdown actions | `DropdownMenu` |
| Toast messages | `Sonner` |
| Data tables | `Table` |
| Accordion/expand | `Accordion` |
| Tier/plan cards | `Card` |

---

## Project File Map (Key Files)

```
src/
├── App.tsx                          # Router: all routes defined here
├── routes/
│   ├── Dashboard.tsx                # HOME tab — ProfileCard + LockedAssetsGrid
│   ├── Notifications.tsx            # NOTIFICATIONS tab
│   ├── Profile.tsx                  # PROFILE tab
│   ├── History.tsx                  # Payment history
│   ├── Payment.tsx                  # Tier selection / payment
│   ├── Upgrade.tsx                  # Upgrade flow
│   ├── Processing.tsx               # Loading/processing state
│   ├── Auth/Login.tsx               # Login page
│   └── Admin/
│       ├── Index.tsx                # Admin dashboard
│       └── Notifications.tsx        # Admin notification sender
├── components/
│   ├── shared/
│   │   ├── BottomTabs.tsx           # Nav: HOME / NOTIFICATIONS / PROFILE
│   │   ├── Header.tsx               # Top header bar
│   │   ├── PageLayout.tsx           # Wrapper with header + bottom tabs
│   │   └── Loader.tsx               # Spinner/loading state
│   ├── dashboard/
│   │   ├── ProfileCard.tsx          # User info card on Dashboard
│   │   ├── LockedAssetCard.tsx      # Single locked asset tile
│   │   └── LockedAssetsGrid.tsx     # Grid of locked assets
│   ├── notifications/
│   │   ├── NotificationSheet.tsx    # Sheet panel for notifications
│   │   ├── NotificationList.tsx     # List of notifications
│   │   ├── NotificationItem.tsx     # Single notification row
│   │   ├── NotificationDetail.tsx   # Full detail view
│   │   └── NotificationPreview.tsx  # Preview snippet
│   ├── payment/
│   │   ├── PaymentDetail.tsx
│   │   ├── PaymentSummary.tsx
│   │   ├── BenefitsList.tsx
│   │   ├── InvoiceExport.tsx
│   │   └── SuccessState.tsx
│   ├── history/
│   │   ├── PaymentTable.tsx
│   │   └── PaymentPreview.tsx
│   └── upgrade/
│       ├── TierCard.tsx
│       ├── TierList.tsx
│       └── UpgradeForm.tsx
├── hooks/
│   ├── useAuth.ts                   # Auth state (Supabase session)
│   ├── useMember.ts                 # Member profile data
│   ├── useNotifications.ts          # Notification list + read state
│   ├── useHistory.ts                # Payment history
│   ├── useUpgrade.ts                # Upgrade flow state
│   └── useTheme.ts                  # Dark/light mode (localStorage key: spacex_theme)
├── types/
│   ├── user.ts
│   ├── notification.ts
│   ├── payment.ts
│   └── upgrade.ts
└── lib/
    ├── api.ts                       # API call helpers
    ├── supabase.ts                  # Supabase client init
    └── queryKeys.ts                 # TanStack Query key constants
```

---

## Debugging Protocol

When a UI component is broken, follow this exact order:

1. **Identify** — Read the error message. Is it a missing import, wrong prop type, or runtime crash?
2. **Locate** — Find the file. Check `src/components/ui/` for the shadcn version first.
3. **Check imports** — Run `grep -n "import" <file>.tsx` and verify every import resolves.
4. **Check props** — Compare props used vs props expected by the component interface.
5. **Fix** — Use the correct shadcn component with the correct import path.
6. **Verify** — Run `npx tsc --noEmit` after fixing. No new errors = done.

### Common Breakage Patterns

```tsx
// ❌ BROKEN: wrong cn() import
import { cn } from "utils"
// ✅ FIX:
import { cn } from "@/lib/utils"

// ❌ BROKEN: Sheet without SheetContent
<Sheet><div>...</div></Sheet>
// ✅ FIX:
<Sheet><SheetContent>...</SheetContent></Sheet>

// ❌ BROKEN: Card without structure
<Card><p>text</p></Card>
// ✅ FIX:
<Card><CardHeader><CardTitle>Title</CardTitle></CardHeader><CardContent><p>text</p></CardContent></Card>

// ❌ BROKEN: Badge with wrong variant
<Badge variant="green">Active</Badge>
// ✅ FIX: valid variants are "default" | "secondary" | "destructive" | "outline"
<Badge variant="default">Active</Badge>
```

---

## Testing Protocol

### Run Before Committing

```bash
# TypeScript check (required)
npx tsc --noEmit

# Build check (required)
pnpm build

# Lint (optional but recommended)
npx eslint src/ --ext .tsx,.ts
```

### Manual Test Checklist

Before marking a fix done, verify these pages render without errors:

- [ ] `/` — Dashboard: ProfileCard visible, LockedAssetsGrid renders
- [ ] `/notifications` — List renders, NotificationSheet opens on click
- [ ] `/profile` — Member info loads, sign out button works
- [ ] `/history` — PaymentTable renders with correct columns
- [ ] `/upgrade` — TierList shows Explorer and Pioneer cards
- [ ] `/payment` — Payment form / summary renders
- [ ] `/processing` — Loader/spinner shows
- [ ] `/login` — Login form renders
- [ ] `/admin` — Admin dashboard renders
- [ ] `/admin/notifications` — Notification form renders

### Theme Test

Toggle dark/light mode via `localStorage.setItem('spacex_theme', 'light')` and reload. Both themes must render without broken styles.

---

## Environment

```bash
# Install
pnpm install

# Dev server
pnpm dev         # http://localhost:5173

# Build
pnpm build

# Preview build
pnpm preview
```

### Environment Variables (`.env.local`)

```
VITE_SUPABASE_URL=<your_supabase_url>
VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

---

## Rules for Copilot

1. **Always search `src/components/ui/` before creating a custom component.**
2. **Never import from `shadcn/ui` directly** — always use `@/components/ui/<name>`.
3. **Run `audit-ui.sh` first** when starting a fix session to get a full picture.
4. **One file per fix.** Don't refactor unrelated files.
5. **TypeScript must pass** after every change (`npx tsc --noEmit`).
6. **Theme variables:** dark mode is default (no `dark` class), light mode adds `.light` class on `<html>`. Use CSS variables, not hardcoded hex.
7. **React Router v6** — use `<Link to="...">` not `<a href>` for internal routes. Use `useNavigate()` for programmatic navigation.
8. **TanStack Query** — all data fetching goes through custom hooks in `src/hooks/`. Never fetch directly in a component.
