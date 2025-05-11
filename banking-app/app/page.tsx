import { Suspense } from "react"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Testimonials from "@/components/testimonials"
import FAQ from "@/components/faq"
import { Loader2 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <Hero />
          <Features />
          <Testimonials />
          <FAQ />
        </Suspense>
      </main>
    </div>
  )
}
