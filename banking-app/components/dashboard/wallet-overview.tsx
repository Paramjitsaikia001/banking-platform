import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"

export default function WalletOverview() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Wallet Overview</CardTitle>
        <CardDescription>Your current balance and spending</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">Total Balance</div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-3xl font-bold">$12,345.67</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <div className="flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                <span>Income</span>
              </div>
              <span>$8,240.00</span>
            </div>
            <Progress value={70} className="h-2 bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <div className="flex items-center">
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                <span>Expenses</span>
              </div>
              <span>$5,894.33</span>
            </div>
            <Progress value={45} className="h-2 bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
