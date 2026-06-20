import type { PaymentRecord } from "@/types/payment";

export function PaymentDetail({ row }: { row: PaymentRecord }) {
  return (
    <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-6">
      <h3 className="mb-4 text-lg font-semibold">{row.tier}</h3>
      <dl className="grid grid-cols-2 gap-y-3 text-sm">
        <dt className="text-[var(--muted)]">Date</dt>
        <dd className="text-right font-mono-data">{row.date}</dd>
        <dt className="text-[var(--muted)]">Amount</dt>
        <dd className="text-right font-mono-data">{row.amount}</dd>
        <dt className="text-[var(--muted)]">Status</dt>
        <dd className="text-right">{row.status}</dd>
        <dt className="text-[var(--muted)]">Reference</dt>
        <dd className="text-right font-mono-data text-xs">{row.reference}</dd>
      </dl>
    </div>
  );
}
