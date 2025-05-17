import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ProfileInfo from "@/components/profile/profile-info"
import SecuritySettings from "@/components/profile/security-settings"
import NotificationPreferences from "@/components/profile/notification-preferences"
import LinkedAccounts from "@/components/profile/linked-accounts"

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <ProfileInfo />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <SecuritySettings />
        </Suspense>
      </div>
      
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <NotificationPreferences />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <LinkedAccounts />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
