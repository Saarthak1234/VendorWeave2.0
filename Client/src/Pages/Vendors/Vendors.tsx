import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"

const vendors = [
  {
    id: "v1",
    name: "Vendor Alpha",
    firm: "Alpha Corp",
    score: 82,
    points: 420,
  },
  {
    id: "v2",
    name: "Vendor Beta",
    firm: "Nimbus Ltd",
    score: 75,
    points: 380,
  },
  {
    id: "v3",
    name: "Vendor Gamma",
    firm: "Orion Group",
    score: 88,
    points: 450,
  },
  {
    id: "v4",
    name: "Vendor Delta",
    firm: "Vertex Inc",
    score: 68,
    points: 320,
  },
]

export default function Vendors() {
  const navigate = useNavigate()

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-800"
    if (score >= 75) return "bg-blue-100 text-blue-800"
    if (score >= 65) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="max-w-300 mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Vendors</h1>

      {/* Filters Section */}
      <div className="flex gap-4">
        {/* Filter placeholders - implement later */}
        <div className="text-sm text-muted-foreground">
          Filters coming soon
        </div>
      </div>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1 flex-1">
                  <p className="font-medium">{vendor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {vendor.firm}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Health Score</p>
                    <Badge className={getScoreBadgeColor(vendor.score)}>
                      {vendor.score}%
                    </Badge>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Points</p>
                    <p className="font-semibold">{vendor.points}</p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => navigate(`/vendors/${vendor.id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}