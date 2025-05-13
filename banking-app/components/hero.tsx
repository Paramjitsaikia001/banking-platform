import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default function Hero() {
  return (
    <section className="flex justify-center items-center w-full py-12 md:py-24 lg:py-32 xl:py-0 min-h-[calc(100vh-4rem)]">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Banking Made Simple, Secure, and Smart
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Manage your finances, make payments, and track your spending all in one place. Experience the future of
                banking today.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Secure transactions</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[4/4] overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 p-1">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-[80%] rounded-lg bg-background/80 backdrop-blur-sm p-4 md:p-8 shadow-lg">
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xl font-bold">Your Wallet</h3>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-3xl font-bold">$12,345.67</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline">
                      Send Money
                    </Button>
                    <Button size="sm" variant="outline">
                      Add Money
                    </Button>
                    <Button size="sm" variant="outline">
                      Pay Bills
                    </Button>
                    <Button size="sm" variant="outline">
                      Scan QR
                    </Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Coffee Shop</span>
                      <span className="font-medium">-$4.50</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Salary</span>
                      <span className="font-medium text-green-600">+$3,000.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Grocery Store</span>
                      <span className="font-medium">-$65.75</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}