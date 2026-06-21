# Skill: shadcn-component

**Triggers:** Any time you fix, replace, or add a UI component. Any broken layout or visual glitch.

---

## Step 1: Discover Before You Build

```bash
# List all installed shadcn components
ls src/components/ui/

# Check if the component you need exists
ls src/components/ui/ | grep <component-name>
```

If it exists → import it. If it doesn't → add it:

```bash
npx shadcn@latest add <component-name>
```

---

## Step 2: Correct Import Pattern

Every shadcn component lives at `@/components/ui/<name>`. Always:

```ts
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
```

---

## Step 3: Required Sub-Components

These shadcn components REQUIRE specific child structure or they break silently:

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
```

### Sheet (used for NotificationSheet)
```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Notifications</SheetTitle>
    </SheetHeader>
    {/* content */}
  </SheetContent>
</Sheet>
```

### Dialog
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
    </DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>
```

### AlertDialog (for logout confirm)
```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Sign Out</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Sign out?</AlertDialogTitle>
      <AlertDialogDescription>You will be logged out.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleSignOut}>Sign Out</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Badge — Valid Variants
```tsx
// Only these variants exist:
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="outline">Draft</Badge>
```

### Table
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Date</TableHead>
      <TableHead>Amount</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map(row => (
      <TableRow key={row.id}>
        <TableCell>{row.date}</TableCell>
        <TableCell>{row.amount}</TableCell>
        <TableCell><Badge>{row.status}</Badge></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Skeleton (loading state)
```tsx
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

---

## Step 4: cn() Utility

Always compose class names using `cn()`:

```ts
import { cn } from "@/lib/utils"

// Usage
<div className={cn("base-class", condition && "conditional-class", className)}>
```

---

## Step 5: Variant Props Pattern

When wrapping shadcn components, forward variants correctly:

```tsx
import { type ButtonProps } from "@/components/ui/button"

interface MyButtonProps extends ButtonProps {
  loading?: boolean
}

export function MyButton({ loading, children, ...props }: MyButtonProps) {
  return (
    <Button disabled={loading} {...props}>
      {loading ? <Skeleton className="h-4 w-16" /> : children}
    </Button>
  )
}
```

---

## Step 6: Theme-Aware Styling

Use CSS variables, never hardcoded colors:

```tsx
// ✅ CORRECT — uses theme variables
<div className="bg-background text-foreground border-border">

// ❌ WRONG — breaks dark mode
<div style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
```

Key variables: `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `border-border`, `ring-ring`, `text-primary`, `bg-primary`.
