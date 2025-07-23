// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/context/auth-context";
// import Hero from "@/components/hero";
// import Features from "@/components/features";
// import Testimonials from "@/components/testimonials";
// import FAQ from "@/components/faq";
// import Footer from "@/components/footer";

// export default function HomePage() {
//   const { user, isLoading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoading && user) {
//       router.replace("/dashboard");
//     }
//   }, [user, isLoading, router]);

//   if (!isLoading && user) {
//     return null;
//   }

//   return (
//     <>
//       <Hero />
//       <Features />
//       <Testimonials />
//       <FAQ />
//       <Footer />
//     </>
//   );
// }


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

  // ✅ Define your backend URL from env
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Example useEffect to fetch something from backend
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }

    // Optional: example backend request
    const getSomething = async () => {
      try {
        const res = await fetch(`${API_URL}/api/some-route`);
        const data = await res.json();
        console.log("Backend response:", data);
      } catch (error) {
        console.error("Failed to fetch from backend", error);
      }
    };

    getSomething();
  }, [user, isLoading, router, API_URL]);

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
