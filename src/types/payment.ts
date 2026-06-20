export interface PaymentRecord {
  id: string;
  date: string;
  tier: string;
  amount: string;
  status: "Approved" | "Pending" | "Rejected";
  reference: string;
  read?: boolean;
}
