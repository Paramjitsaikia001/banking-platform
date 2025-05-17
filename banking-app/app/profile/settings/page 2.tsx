import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AppearanceSettings from "@/components/settings/appearance-settings"
import PrivacySettings from "@/components/settings/privacy-settings"
import NotificationSettings from "@/components/settings/notification-settings"
import DeviceSettings from "@/components/settings/device-settings"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <AppearanceSettings />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <PrivacySettings />
          </Suspense>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <NotificationSettings />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <DeviceSettings />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  )
}
