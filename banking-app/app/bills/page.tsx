import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import BillCategories from "@/components/bills/bill-categories"
import SavedBillers from "@/components/bills/saved-billers"
import UpcomingPayments from "@/components/bills/upcoming-payments"

export default function BillsPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <BillCategories />
          </Suspense>
          <div className="mt-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <SavedBillers />
            </Suspense>
          </div>
        </div>
        <div className="md:col-span-1">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <UpcomingPayments />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  )
}
