/**
 * Landing Page Component
 * 
 * This is the main landing page of the banking platform that users see
 * when they first visit the application. It showcases:
 * - Hero section with main value proposition
 * - Features overview
 * - Customer testimonials
 * - Frequently asked questions
 * 
 * The page uses React Suspense for better loading performance,
 * showing a loading spinner while components are being loaded.
 */

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
        {/* Suspense wrapper for better loading performance */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          {/* Hero section: Main value proposition and call-to-action */}
          <Hero />
          {/* Features section: Overview of banking platform capabilities */}
          <Features />
          {/* Testimonials: Social proof from existing customers */}
          <Testimonials />
          {/* FAQ: Common questions and answers */}
          <FAQ />
        </Suspense>
      </main>
    </div>
  )
}
