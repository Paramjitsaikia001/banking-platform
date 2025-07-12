import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import LinkedBankAccounts from "@/components/bank-accounts/linked-bank-accounts"
import LinkNewBankAccount from "@/components/bank-accounts/link-new-bank-account"

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
        </div>
      </div>
    </DashboardLayout>
  )
}
