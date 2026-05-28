import { IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "../components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"

interface SectionCardsProps {
  totalFirms?: number
  totalVendors?: number
  avgHealth?: number
}

export function SectionCards({ totalFirms = 0, totalVendors = 0, avgHealth = 0 }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 md:grid-cols-2 lg:grid-cols-4">

      {/* TOTAL FIRMS */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Firms</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalFirms}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Active firms on platform
          </div>
        </CardFooter>
      </Card>

      {/* TOTAL VENDORS */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Firm Vendors</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalVendors}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Vendors linked to active firm
          </div>
        </CardFooter>
      </Card>

      {/* AVG HEALTH SCORE */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg Health Score</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {avgHealth}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Based on active firm vendors
          </div>
        </CardFooter>
      </Card>

      {/* GROWTH RATE */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            +4.5%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Month-over-month platform growth
          </div>
        </CardFooter>
      </Card>

    </div>
  )
}
