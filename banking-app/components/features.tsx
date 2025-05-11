import { CreditCard, Wallet, Send, QrCode, Receipt, Bell, Shield, Smartphone } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Wallet className="h-10 w-10 text-primary" />,
      title: "Digital Wallet",
      description: "Store, send, and receive money instantly with our secure digital wallet system.",
    },
    {
      icon: <Send className="h-10 w-10 text-primary" />,
      title: "Easy Transfers",
      description: "Transfer money to friends, family, or businesses with just a few taps.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Bank Integration",
      description: "Link your bank accounts for seamless transfers and complete financial management.",
    },
    {
      icon: <QrCode className="h-10 w-10 text-primary" />,
      title: "QR Payments",
      description: "Generate or scan QR codes for quick and secure contactless payments.",
    },
    {
      icon: <Receipt className="h-10 w-10 text-primary" />,
      title: "Bill Payments",
      description: "Pay utility bills, mobile recharges, and subscriptions all in one place.",
    },
    {
      icon: <Bell className="h-10 w-10 text-primary" />,
      title: "Smart Notifications",
      description: "Get real-time alerts for transactions, bill due dates, and account updates.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Secure Authentication",
      description: "Multi-factor authentication and biometric security to protect your account.",
    },
    {
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: "Mobile First",
      description: "Designed for the modern user with a responsive interface that works on any device.",
    },
  ]

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need in One App</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our banking platform combines all essential financial tools in one secure, easy-to-use application.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 rounded-lg border p-4 transition-all hover:bg-accent"
            >
              <div className="p-2">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
