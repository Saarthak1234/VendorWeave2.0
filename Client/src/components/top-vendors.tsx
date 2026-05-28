import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

type Vendor = {
  id: string
  name: string
  firm: string
  score: number
}

export function TopVendors({ vendors = [] }: { vendors?: Vendor[] }) {
  const topVendors = [...vendors]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Top Vendors by Score
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {topVendors.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No vendors found.</p>
        ) : (
          topVendors.map((vendor) => (
            <div
              key={vendor.id || vendor.name}
              className="flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{vendor.name}</span>
                <span className="text-xs text-muted-foreground">
                  {vendor.firm || "Active Firm"}
                </span>
              </div>
              <Badge variant="secondary" className={
                vendor.score >= 80 ? "bg-green-100 text-green-800" :
                vendor.score >= 50 ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }>
                {vendor.score}%
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
