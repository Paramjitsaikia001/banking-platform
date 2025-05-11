import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import PaymentOptions from "@/components/payments/payment-options"
import RecentPayees from "@/components/payments/recent-payees"
import QRCodePayment from "@/components/payments/qr-code-payment"

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <PaymentOptions />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <RecentPayees />
        </Suspense>
      </div>
      <div className="mt-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <QRCodePayment />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
