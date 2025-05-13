import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import NotificationsList from "@/components/notifications/notifications-list"
import NotificationFilters from "@/components/notifications/notification-filters"
import NotificationSummary from "@/components/notifications/notification-summary"

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Stay updated with account activities and important alerts.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[500px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <NotificationsList />
            </Suspense>
          </div>
          <div className="space-y-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <NotificationSummary />
            </Suspense>
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <NotificationFilters />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
