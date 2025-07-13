"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Testimonials from "@/components/testimonials"
import FAQ from "@/components/faq"
import Footer from "@/components/footer"

export default function HomePage() {
  const { user } = useUser()
  const router = useRouter()

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (user) {
      router.replace("/dashboard")
    }
  }, [user, router])

  // Don't render landing page content if user is logged in
  if (user) {
    return null
  }

  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  )
}
