"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (!isLoading && user) {
    return null;
  }

  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
}
