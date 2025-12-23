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

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 md:grid-cols-2">

      {/* TOTAL FIRMS */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Firms</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            128
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +6%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Growing steadily <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Active firms on platform
          </div>
        </CardFooter>
      </Card>

      {/* TOTAL VENDORS */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Vendors</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            842
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +11%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong onboarding momentum <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Vendors linked to firms
          </div>
        </CardFooter>
      </Card>

      {/* AVG HEALTH SCORE */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg Health Score</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            82%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Platform health improving <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Based on firm & vendor activity
          </div>
        </CardFooter>
      </Card>

      {/* GROWTH RATE */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Consistent expansion <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Month-over-month platform growth
          </div>
        </CardFooter>
      </Card>

    </div>
  )
}
