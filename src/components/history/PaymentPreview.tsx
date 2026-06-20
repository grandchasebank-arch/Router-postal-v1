import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Download, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import { usePaymentById } from "@/hooks/useHistory";
import { Loader } from "@/components/shared/Loader";

const STATUS_COLOR: Record<string, string> = {
  Approved: "text-[var(--success)]",
  Pending: "text-[var(--pending)]",
  Rejected: "text-[#ef4444]",
};

const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  label: {
    fontSize: 11,
    color: "#6b7280",
  },
  value: {
    fontSize: 12,
    fontWeight: "500",
  },
});

interface ReceiptPDFProps {
  payment: any;
}

function ReceiptPDF({ payment }: ReceiptPDFProps) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.header}>Payment Receipt</Text>

        <View style={pdfStyles.section}>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Tier</Text>
            <Text style={pdfStyles.value}>{payment.tier}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Amount</Text>
            <Text style={pdfStyles.value}>{payment.amount}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Status</Text>
            <Text style={pdfStyles.value}>{payment.status}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Date</Text>
            <Text style={pdfStyles.value}>{payment.date}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Reference</Text>
            <Text style={pdfStyles.value}>{payment.reference}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default function PaymentPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: payment, isLoading } = usePaymentById(id || "");
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShareAsImage = async () => {
    if (!receiptRef.current) return;
    setIsSharing(true);
    try {
      const canvas = await html2canvas(receiptRef.current, { backgroundColor: "#ffffff" });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `receipt-${payment?.id}.png`, { type: "image/png" });

        if (navigator.share) {
          try {
            await navigator.share({
              files: [file],
              title: `Receipt for ${payment?.tier} - ${payment?.date}`,
            });
          } catch (error) {
            console.log("[v0] Share cancelled or failed");
          }
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `receipt-${payment?.id}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error("[v0] Error sharing image:", error);
    } finally {
      setIsSharing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--background)] flex justify-center pt-12">
        <Loader size={24} />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--background)] flex flex-col items-center justify-center px-4">
        <p className="text-sm text-[var(--muted)]">Payment not found</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[var(--background)] flex flex-col overflow-hidden">
      {/* Header with back button and receipt label */}
      <div className="flex items-center gap-4 px-5 pt-5 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border-bright)] bg-[var(--surface)] text-[var(--text)] transition hover:opacity-80"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)]">
          <CreditCard size={24} className="text-[var(--muted)]" />
          {!payment.read && (
            <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-blue-500 border-2 border-[var(--background)]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="font-semibold text-[var(--text)] truncate">
            {payment.tier}
          </h1>
          <p className="text-xs text-[var(--muted)]">{payment.date}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--border)]" />

      {/* Content - Receipt preview */}
      <div className="flex-1 overflow-y-auto">
        <div ref={receiptRef} className="px-5 py-6">
          {/* Receipt content with light background */}
          <div className="rounded-xl bg-white p-6 text-[var(--text)]">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs text-[var(--muted)] uppercase">Amount</span>
                <span className="font-semibold text-lg">{payment.amount}</span>
              </div>
              <div className="border-t border-[var(--border)]" />
              <div className="flex justify-between items-start">
                <span className="text-xs text-[var(--muted)] uppercase">Status</span>
                <span className={`text-sm font-semibold ${STATUS_COLOR[payment.status]}`}>
                  {payment.status}
                </span>
              </div>
              <div className="border-t border-[var(--border)]" />
              <div className="flex justify-between items-start">
                <span className="text-xs text-[var(--muted)] uppercase">Date</span>
                <span className="text-sm">{payment.date}</span>
              </div>
              <div className="border-t border-[var(--border)]" />
              <div className="flex justify-between items-start">
                <span className="text-xs text-[var(--muted)] uppercase">Reference</span>
                <span className="text-xs font-mono text-right">{payment.reference}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom action buttons */}
      <div className="border-t border-[var(--border)] bg-[var(--background)] px-5 py-4 flex gap-3">
        {/* Download PDF Button */}
        <PDFDownloadLink
          document={<ReceiptPDF payment={payment} />}
          fileName={`receipt-${payment.id}.pdf`}
          className="flex-1"
        >
          {({ blob, url, loading, error }) => (
            <button
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/5"
              disabled={loading}
            >
              <Download size={16} />
              <span>{loading ? "Generating..." : "Download PDF"}</span>
            </button>
          )}
        </PDFDownloadLink>

        {/* Share as Image Button */}
        <button
          onClick={handleShareAsImage}
          disabled={isSharing}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[var(--text)] px-4 py-3 text-sm font-semibold text-[var(--bg)] transition hover:opacity-90 disabled:opacity-50"
        >
          <Share2 size={16} />
          <span>{isSharing ? "Sharing..." : "Share"}</span>
        </button>
      </div>
    </div>
  );
}
