import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

const firms = [
  { name: "Alpha Corp", score: 92 },
  { name: "Nimbus Ltd", score: 89 },
  { name: "Orion Group", score: 87 },
  { name: "Vertex Inc", score: 85 },
  { name: "Nova Systems", score: 83 },
]

export function TopFirms() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Top 5 Firms
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {firms.map((firm) => (
          <div
            key={firm.name}
            className="flex items-center justify-between"
          >
            <span className="text-sm font-medium">{firm.name}</span>
            <Badge variant="secondary">{firm.score}%</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
