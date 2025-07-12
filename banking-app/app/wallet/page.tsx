import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import WalletBalance from "@/components/wallet/wallet-balance"
import TransactionHistory from "@/components/wallet/transaction-history"
import WalletActions from "@/components/wallet/wallet-actions"
import BankAccountsList from "@/components/banks/bank-accounts-list"
import BankBalanceChecker from "@/components/banks/bank-balance-checker"

export default function WalletPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Wallet Overview */}
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

        {/* Bank Accounts */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <BankBalanceChecker />
        </Suspense>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <BankAccountsList 
            title="Linked Bank Accounts"
            description="Your connected bank accounts and their current status"
            showActions={true}
          />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
