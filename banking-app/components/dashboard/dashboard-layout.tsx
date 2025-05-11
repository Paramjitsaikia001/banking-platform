import type React from "react"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 p-6 md:p-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  )
}
