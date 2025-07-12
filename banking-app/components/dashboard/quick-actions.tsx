import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Send, QrCode } from "lucide-react"
import { useRouter } from "next/navigation"

export default function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      icon: <QrCode className="h-6 w-6 text-orange-600" />,
      label: "Scan QR",
      description: "Scan QR code to pay",
      href: "/payments/scan-qr",
      color: "hover:bg-orange-50 border-orange-200"
    },
    {
      icon: <PlusCircle className="h-6 w-6 text-green-600" />,
      label: "Add Money",
      description: "Add funds to wallet",
      href: "/wallet/add-money",
      color: "hover:bg-green-50 border-green-200"
    },
    {
      icon: <Send className="h-6 w-6 text-blue-600" />,
      label: "Send Money",
      description: "Transfer to other users",
      href: "/payments/send-money",
      color: "hover:bg-blue-50 border-blue-200"
    },
  ]

  const handleActionClick = (href: string) => {
    router.push(href)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        <CardDescription>Common banking operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* First row - Scan QR only */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              className={`flex flex-col h-auto items-center justify-center gap-2 p-4 transition-all duration-200 w-auto ${actions[0].color}`}
              onClick={() => handleActionClick(actions[0].href)}
            >
              {actions[0].icon}
              <div className="text-center">
                <span className="text-sm font-medium block">{actions[0].label}</span>
                <span className="text-xs text-muted-foreground">{actions[0].description}</span>
              </div>
            </Button>
          </div>
          
          {/* Second row - Add Money and Send Money */}
          <div className="grid grid-cols-2 gap-3">
            {actions.slice(1).map((action, index) => (
              <Button
                key={index + 1}
                variant="outline"
                className={`flex flex-col h-auto items-center justify-center gap-2 p-4 transition-all duration-200 ${action.color}`}
                onClick={() => handleActionClick(action.href)}
              >
                {action.icon}
                <div className="text-center">
                  <span className="text-sm font-medium block">{action.label}</span>
                  <span className="text-xs text-muted-foreground">{action.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
