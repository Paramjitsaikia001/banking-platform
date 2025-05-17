import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import SupportOptions from "@/components/support/support-options"
import FAQSection from "@/components/support/faq-section"
import ContactSupport from "@/components/support/contact-support"
import SupportTickets from "@/components/support/support-tickets"

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Help & Support</h2>
          <p className="text-muted-foreground">Get assistance and answers to your questions.</p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <SupportOptions />
        </Suspense>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <FAQSection />
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
              <ContactSupport />
            </Suspense>
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <SupportTickets />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
