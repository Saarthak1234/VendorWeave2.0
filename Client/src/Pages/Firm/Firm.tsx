import { useNavigate } from "react-router-dom"

import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"

const firms = [
  { id: "1", name: "Alpha Corp", vendors: 24, health: 92 },
  { id: "2", name: "Nimbus Ltd", vendors: 18, health: 88 },
  { id: "3", name: "Orion Group", vendors: 31, health: 85 },
  { id: "4", name: "Vertex Inc", vendors: 12, health: 81 },
]

export default function Firms() {
  const navigate = useNavigate()

  return (
    <div className="max-w-300 mx-auto px-4 py-6 space-y-6">

      <h1 className="text-2xl font-semibold">Firms</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Firms</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {firms.map((firm) => (
            <div
              key={firm.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-1">
                <p className="font-medium">{firm.name}</p>
                <p className="text-sm text-muted-foreground">
                  {firm.vendors} vendors
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant="secondary">{firm.health}%</Badge>
                <Button
                  size="sm"
                  onClick={() => navigate(`/firm/${firm.id}`)}
                >
                  View Firm
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  )
}
