import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Smartphone, Wifi, Tv, Droplet, CreditCard, Home, Car } from "lucide-react"

export default function BillCategories() {
  const categories = [
    {
      icon: <Zap className="h-5 w-5" />,
      label: "Electricity",
      href: "/bills/electricity",
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      label: "Mobile",
      href: "/bills/mobile",
    },
    {
      icon: <Wifi className="h-5 w-5" />,
      label: "Internet",
      href: "/bills/internet",
    },
    {
      icon: <Tv className="h-5 w-5" />,
      label: "DTH",
      href: "/bills/dth",
    },
    {
      icon: <Droplet className="h-5 w-5" />,
      label: "Water",
      href: "/bills/water",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "Credit Card",
      href: "/bills/credit-card",
    },
    {
      icon: <Home className="h-5 w-5" />,
      label: "Rent",
      href: "/bills/rent",
    },
    {
      icon: <Car className="h-5 w-5" />,
      label: "Insurance",
      href: "/bills/insurance",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Bill Categories</CardTitle>
        <CardDescription>Select a category to pay your bills</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex h-auto flex-col items-center justify-center gap-2 p-4"
              asChild
            >
              <a href={category.href}>
                <div className="rounded-full bg-primary/10 p-2">{category.icon}</div>
                <span className="text-sm">{category.label}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
