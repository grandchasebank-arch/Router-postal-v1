# Skill: testing

**Triggers:** Writing tests, running tests, verifying a fix works.

---

## Test Stack

This project uses **no testing framework by default**. Add Vitest for unit tests:

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Add to `vite.config.ts`:
```ts
test: {
  environment: 'jsdom',
  setupFiles: ['./src/test-setup.ts'],
}
```

Create `src/test-setup.ts`:
```ts
import '@testing-library/jest-dom'
```

---

## Manual Test Checklist (Required Before Any PR)

Run the dev server (`pnpm dev`) and verify each route renders without console errors:

### User Routes
- [ ] `/` — Dashboard loads, ProfileCard shows name/tier, LockedAssetsGrid renders tiles
- [ ] `/notifications` — Notification list loads, clicking item opens Sheet panel
- [ ] `/profile` — Member details visible, sign-out button present
- [ ] `/history` — PaymentTable shows rows with Date / Amount / Status columns
- [ ] `/upgrade` — TierList shows Explorer + Pioneer cards with price and benefits
- [ ] `/payment` — Payment form renders with correct tier info
- [ ] `/processing` — Spinner/progress shows, does not crash
- [ ] `/login` — Auth form renders, input fields work

### Admin Routes
- [ ] `/admin` — Admin dashboard renders
- [ ] `/admin/notifications` — Notification send form renders

### Navigation
- [ ] Bottom tabs: HOME → `/`, NOTIFICATIONS → `/notifications`, PROFILE → `/profile`
- [ ] All tab icons and labels visible in dark mode
- [ ] Active tab highlighted correctly

### Theme
- [ ] Dark mode (default): all text readable, no pure black on black
- [ ] Light mode: `localStorage.setItem('spacex_theme', 'light')` + reload → all text readable

### Responsive
- [ ] At 390px width (iPhone): no horizontal scroll, bottom tabs not clipped
- [ ] At 768px width (tablet): layout still usable

---

## Component Unit Test Pattern

```tsx
// src/components/dashboard/__tests__/ProfileCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ProfileCard } from '../ProfileCard'

const mockMember = {
  name: 'Elon Musk',
  tier: 'Pioneer',
  email: 'elon@spacex.com',
}

test('renders member name and tier', () => {
  render(<ProfileCard member={mockMember} />)
  expect(screen.getByText('Elon Musk')).toBeInTheDocument()
  expect(screen.getByText('Pioneer')).toBeInTheDocument()
})
```

## Hook Test Pattern

```tsx
// src/hooks/__tests__/useNotifications.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTestQueryClient } from '../test-utils'
import { useNotifications } from '../useNotifications'

test('returns notifications array', async () => {
  const wrapper = ({ children }) => (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  )
  const { result } = renderHook(() => useNotifications(), { wrapper })
  await waitFor(() => expect(result.current.isLoading).toBe(false))
  expect(Array.isArray(result.current.data)).toBe(true)
})
```

---

## TypeScript Verification (Always Run)

```bash
# Must pass with 0 errors before committing any fix
npx tsc --noEmit

# If errors appear, fix them in order (top to bottom)
# Don't use `// @ts-ignore` unless absolutely required — and comment why
```

---

## Build Verification

```bash
# Build must succeed
pnpm build

# Expected output:
# dist/index.html
# dist/assets/index-[hash].js  (~150KB gzipped)
# No errors in stdout
```
