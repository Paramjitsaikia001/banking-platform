import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function LinkedAccounts() {
  const accounts = [
    {
      name: "Google",
      email: "john.doe@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Facebook",
      email: "john.doe@facebook.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    // Add more accounts as needed
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Linked Accounts</CardTitle>
        <CardDescription>Manage your connected accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={account.avatar || "/placeholder.svg"} alt={account.name} />
                  <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{account.name}</p>
                  <p className="text-xs text-muted-foreground">{account.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Unlink
              </Button>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            Link New Account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
