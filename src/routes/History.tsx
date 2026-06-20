import { Loader } from '@/components/shared/Loader'
import { PaymentTable } from '@/components/history/PaymentTable'
import { useHistory } from '@/hooks/useHistory'

export default function History() {
  const { data, isLoading } = useHistory()

  return (
    <>
      <div className="mb-6 animate-slide-up">
        <h1 className="mb-1 text-[28px] font-semibold tracking-[-0.02em]">
          Payment History
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Records of your tier upgrades and contributions
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center pt-12">
          <Loader size={24} />
        </div>
      ) : (
        <PaymentTable rows={data ?? []} />
      )}
    </>
  )
}
