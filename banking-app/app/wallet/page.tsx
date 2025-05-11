import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import WalletBalance from "@/components/wallet/wallet-balance"
import TransactionHistory from "@/components/wallet/transaction-history"
import WalletActions from "@/components/wallet/wallet-actions"

export default function WalletPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <WalletBalance />
          </Suspense>
          <div className="mt-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <WalletActions />
            </Suspense>
          </div>
        </div>
        <div className="md:col-span-2">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <TransactionHistory />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  )
}
