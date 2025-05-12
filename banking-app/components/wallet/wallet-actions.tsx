import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowUpRight, ArrowDownRight, CreditCard, Building } from "lucide-react"
import Link from "next/link"

export default function WalletActions() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Wallet Actions</CardTitle>
        <CardDescription>Manage your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button className="flex items-center justify-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add Money</span>
          </Button>
          <Button className="flex items-center justify-center gap-2">
            <ArrowUpRight className="h-4 w-4" />
            <span>Send Money</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <ArrowDownRight className="h-4 w-4" />
            <span>Request Money</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Link Card</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2 col-span-2" asChild>
            <Link href="/bank-accounts">
              <Building className="h-4 w-4 mr-2" />
              <span>Manage Bank Accounts</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
