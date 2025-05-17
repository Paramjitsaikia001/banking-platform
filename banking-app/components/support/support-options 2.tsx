import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Phone, Mail, FileQuestion, Video, BookOpen } from "lucide-react"
import Link from "next/link"

export default function SupportOptions() {
  const options = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Live Chat",
      description: "Chat with our support team",
      href: "#chat",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Call us directly",
      href: "#phone",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      description: "Send us an email",
      href: "#email",
    },
    {
      icon: <FileQuestion className="h-6 w-6" />,
      title: "FAQ",
      description: "Find quick answers",
      href: "#faq",
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Video Tutorials",
      description: "Learn how to use the app",
      href: "#tutorials",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Knowledge Base",
      description: "Detailed guides and articles",
      href: "#knowledge-base",
    },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto flex flex-col items-center justify-center gap-2 p-4"
              asChild
            >
              <Link href={option.href}>
                <div className="rounded-full bg-primary/10 p-3 mb-2">{option.icon}</div>
                <span className="font-medium">{option.title}</span>
                <span className="text-xs text-muted-foreground text-center">{option.description}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
