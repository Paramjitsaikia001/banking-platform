import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import LinkedBankAccounts from "@/components/bank-accounts/linked-bank-accounts"
import LinkNewBankAccount from "@/components/bank-accounts/link-new-bank-account"
import TransferFunds from "@/components/bank-accounts/transfer-funds"
import RecentBankTransfers from "@/components/bank-accounts/recent-bank-transfers"

export default function BankAccountsPage() {
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
            <LinkedBankAccounts />
          </Suspense>
          <div className="mt-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <RecentBankTransfers />
            </Suspense>
          </div>
        </div>
        <div className="md:col-span-1">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <LinkNewBankAccount />
          </Suspense>
          <div className="mt-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <TransferFunds />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
