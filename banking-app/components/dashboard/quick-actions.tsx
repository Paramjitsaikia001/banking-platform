import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Send, CreditCard, QrCode, Receipt } from "lucide-react"

export default function QuickActions() {
  const actions = [
    {
      icon: <PlusCircle className="h-5 w-5" />,
      label: "Add Money",
      href: "/wallet/add",
    },
    {
      icon: <Send className="h-5 w-5" />,
      label: "Send Money",
      href: "/payments/send",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "Pay Card",
      href: "/payments/card",
    },
    {
      icon: <QrCode className="h-5 w-5" />,
      label: "Scan QR",
      href: "/payments/qr",
    },
    {
      icon: <Receipt className="h-5 w-5" />,
      label: "Pay Bills",
      href: "/bills",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common banking operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex flex-col h-auto items-center justify-center gap-1 p-3"
              asChild
            >
              <a href={action.href}>
                {action.icon}
                <span className="text-xs font-normal">{action.label}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
