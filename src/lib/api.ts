/**
 * Mock API layer.
 * Only place in the app where data fetching lives. Swap each function's body
 * for a real `fetch(import.meta.env.VITE_API_BASE_URL + ...)` when wiring a backend.
 */
import type { Member } from "@/types/user";
import type { TierOption, UpgradeRequest } from "@/types/upgrade";
import type { PaymentRecord } from "@/types/payment";
import type { AppNotification } from "@/types/notification";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SESSION_KEY = "spacex_session";
const MEMBER_KEY = "member_id";

// ── Auth ────────────────────────────────────────────────────────────────────
export async function sendOTP(email: string) {
  await wait(600);
  // Demo: always succeed.
  return { ok: true, email };
}

export async function verifyOTP(email: string, code: string) {
  await wait(700);
  if (code.length !== 6) {
    throw new Error("Invalid code");
  }
  const session = {
    member_id: "mbr_demo_001",
    email,
    issued_at: Date.now(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(MEMBER_KEY, session.member_id);
  }
  return session;
}

export async function isLoggedIn(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(SESSION_KEY);
}

export async function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(MEMBER_KEY);
  }
}

// ── Member ──────────────────────────────────────────────────────────────────
export async function getMember(): Promise<Member> {
  await wait(300);
  return {
    id: "mbr_demo_001",
    email: "operator@spacex.hq",
    name: "Commander A. Reyes",
    subtitle: "Member · Restricted Clearance",
    tier: "Explorer",
    clearance: "Level 1",
    status: "Active",
    joined: "Joined Mar 2024",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };
}

// ── Upgrade tiers ───────────────────────────────────────────────────────────
export async function getUpgradeTiers(): Promise<TierOption[]> {
  await wait(150);
  return [
    {
      id: "tier-ex",
      name: "Explorer",
      price: "$1,500",
      priceValue: 1500,
      clearance: "Clearance Level 1",
      description:
        "Entry-level intelligence and ecosystem access for mission observers.",
      features: [
        "Weekly mission intelligence briefings",
        "Digital VIP credentials & member badge",
        "Basic profit distribution participation (0.5% base)",
        "Invitation to public SpaceX launch viewings",
      ],
      benefits: [
        "Weekly mission intelligence briefings",
        "Digital VIP credentials & member badge",
        "SpaceX launch viewing invitations",
      ],
      variant: "explorer",
    },
    {
      id: "tier-pi",
      name: "Pioneer",
      price: "$4,000",
      priceValue: 4000,
      clearance: "Clearance Level 2",
      description:
        "Advanced operational access with guaranteed presence at major hardware reveals.",
      features: [
        "Guaranteed VIP Passes to Tesla AI Day & Robotaxi events",
        "3× Enhanced monthly profit dividends (1.5% base)",
        "Priority seating at Starbase launch events",
        "Access to Private Member Discord for Alpha news",
      ],
      benefits: [
        "Guaranteed VIP passes to Tesla events",
        "3× Enhanced monthly profit dividends",
        "Priority seating at Starbase events",
        "Private Member Discord access",
      ],
      variant: "pioneer",
    },
    {
      id: "tier-va",
      name: "Vanguard",
      price: "$6,000",
      priceValue: 6000,
      clearance: "Full Operational Clearance",
      description:
        "The inner circle. Direct engagement with leadership and maximum ecosystem yields.",
      features: [
        "Private 1-on-1 Strategy Meeting with Elon Musk",
        "Maximum monthly profit dividend tier (3.5% target)",
        "Vanguard Council mission voting rights",
        "Lifetime VIP access to Starbase Launch Control",
        "Limited Edition Titanium Physical Membership Card",
      ],
      benefits: [
        "Private 1-on-1 with Elon Musk",
        "Maximum monthly profit dividend tier",
        "Vanguard Council voting rights",
        "Lifetime VIP Starbase access",
      ],
      variant: "vanguard",
    },
  ];
}

export async function submitUpgradeRequest(req: UpgradeRequest) {
  await wait(900);
  return { ok: true, reference: `UPG-${Date.now().toString(36).toUpperCase()}` };
}

// ── Notifications ───────────────────────────────────────────────────────────
export async function getNotifications(): Promise<AppNotification[]> {
  await wait(250);
  return [
    {
      id: "n1",
      kind: "upgrade",
      title: "Upgrade Request Approved",
      message:
        "Your Pioneer tier upgrade has been reviewed and approved. Welcome aboard.",
      time: "2h ago",
      unread: true,
    },
    {
      id: "n2",
      kind: "profit",
      title: "Monthly Dividend Posted",
      message: "Your March yield distribution has been credited to your wallet.",
      time: "1d ago",
      unread: true,
    },
    {
      id: "n3",
      kind: "event",
      title: "Starbase Launch Window",
      message:
        "Next Starship orbital test scheduled — confirm your VIP attendance.",
      time: "3d ago",
      unread: false,
    },
    {
      id: "n4",
      kind: "badge",
      title: "Member Badge Issued",
      message: "Your digital VIP credentials are now active in your wallet.",
      time: "1w ago",
      unread: false,
    },
    {
      id: "n5",
      kind: "system",
      title: "Security Notice",
      message: "New sign-in detected from a recognized device.",
      time: "2w ago",
      unread: false,
    },
  ];
}

export async function getNotificationById(
  id: string
): Promise<AppNotification | null> {
  await wait(200);
  const notifications = await getNotifications();
  return notifications.find((n) => n.id === id) ?? null;
}

export async function markAllNotificationsRead() {
  await wait(200);
  return { ok: true };
}

// ── History ─────────────────────────────────────────────────────────────────
export async function getHistory(): Promise<PaymentRecord[]> {
  await wait(250);
  return [
    {
      id: "p1",
      date: "Mar 12, 2025",
      tier: "Pioneer",
      amount: "$4,000",
      status: "Approved",
      reference: "PMT-9X2K1A",
    },
    {
      id: "p2",
      date: "Jan 04, 2025",
      tier: "Explorer",
      amount: "$1,500",
      status: "Approved",
      reference: "PMT-72BC0Z",
    },
    {
      id: "p3",
      date: "Dec 18, 2024",
      tier: "Explorer",
      amount: "$1,500",
      status: "Pending",
      reference: "PMT-44H8MQ",
    },
  ];
}

export async function getPaymentById(id: string): Promise<PaymentRecord | null> {
  await wait(200);
  const payments = await getHistory();
  return payments.find((p) => p.id === id) ?? null;
}

// ── Admin ───────────────────────────────────────────────────────────────────
export async function adminNotifyMember(memberId: string, message: string) {
  await wait(500);
  return { ok: true, memberId, message };
}
