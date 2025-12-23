import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

const vendors = [
  { name: "Swift Supplies", firm: "Alpha Corp", score: 91 },
  { name: "BluePeak Services", firm: "Nimbus Ltd", score: 88 },
  { name: "Core Logistics", firm: "Orion Group", score: 86 },
  { name: "Zenith Works", firm: "Vertex Inc", score: 84 },
  { name: "Pulse Traders", firm: "Nova Systems", score: 82 },
]

export function TopVendors() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Top 5 Vendors
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {vendors.map((vendor) => (
          <div
            key={vendor.name}
            className="flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{vendor.name}</span>
              <span className="text-xs text-muted-foreground">
                {vendor.firm}
              </span>
            </div>
            <Badge variant="secondary">{vendor.score}%</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
