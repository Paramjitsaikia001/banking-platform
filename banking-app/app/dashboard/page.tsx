import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import WalletOverview from "@/components/dashboard/wallet-overview"
import RecentTransactions from "@/components/dashboard/recent-transactions"
import QuickActions from "@/components/dashboard/quick-actions"
import UpcomingBills from "@/components/dashboard/upcoming-bills"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <WalletOverview />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <QuickActions />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <UpcomingBills />
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
          <RecentTransactions />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
