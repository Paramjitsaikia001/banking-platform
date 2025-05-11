"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CreditCard,
  Home,
  Wallet,
  Send,
  Receipt,
  Bell,
  Settings,
  User,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useAuth } from "@/app/context/auth-context"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Wallet, label: "Wallet", href: "/wallet" },
    { icon: Send, label: "Payments", href: "/payments" },
    { icon: Receipt, label: "Bills", href: "/bills" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/profile/settings" },
    { icon: HelpCircle, label: "Help & Support", href: "/support" },
  ]

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-40 md:hidden shadow-lg rounded-full h-12 w-12"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-background border-r transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6" />
            <span className="font-bold text-xl">BankApp</span>
          </Link>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-4">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
                onClick={() => {
                  setIsOpen(false)
                  logout()
                }}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </nav>
          </div>
        </ScrollArea>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Spacer for desktop */}
      <div className="hidden md:block w-64 shrink-0" />
    </>
  )
}
