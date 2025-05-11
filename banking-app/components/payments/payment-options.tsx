import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, CreditCard, Smartphone, QrCode, Users, Receipt } from "lucide-react"

export default function PaymentOptions() {
  const options = [
    {
      icon: <Send className="h-5 w-5" />,
      label: "Send Money",
      description: "Transfer to contacts",
      href: "/payments/send",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "Pay Card",
      description: "Credit/Debit cards",
      href: "/payments/card",
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      label: "Mobile Recharge",
      description: "Prepaid/Postpaid",
      href: "/payments/mobile",
    },
    {
      icon: <QrCode className="h-5 w-5" />,
      label: "Scan & Pay",
      description: "QR code payments",
      href: "/payments/qr",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Request Money",
      description: "From contacts",
      href: "/payments/request",
    },
    {
      icon: <Receipt className="h-5 w-5" />,
      label: "Pay Bills",
      description: "Utilities & more",
      href: "/bills",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Payment Options</CardTitle>
        <CardDescription>Choose how you want to pay</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex h-auto flex-col items-start justify-start gap-1 p-4 text-left"
              asChild
            >
              <a href={option.href}>
                <div className="flex w-full items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2">{option.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
