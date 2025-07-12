import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import BankAccountLinking from "@/components/banks/bank-account-linking"

export default function BanksPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Link Bank Account</h1>
          <p className="text-muted-foreground">
            Connect your bank account to enable seamless transactions and balance checking.
          </p>
        </div>
        
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <BankAccountLinking />
        </Suspense>
      </div>
    </DashboardLayout>
  )
} 