import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Small Business Owner",
      content:
        "This banking app has transformed how I manage my business finances. The bill payment feature saves me hours every month.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
    },
    {
      name: "Sarah Williams",
      role: "Freelance Designer",
      content:
        "I love how easy it is to track my income and expenses. The instant notifications keep me informed about every transaction.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "College Student",
      content:
        "The wallet feature is perfect for splitting bills with roommates. The QR code payments make it super convenient.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Manager",
      content:
        "The security features give me peace of mind. Two-factor authentication and instant alerts make me feel safe.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="flex justify-center w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Don't just take our word for it. Here's what our customers have to say about their experience.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 mt-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border bg-background">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </div>
                <div className="ml-auto flex items-center">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                  {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-muted" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
