import { useParams, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"

export default function FirmDetailsPage() {
  const { firmId } = useParams()

  // mock data (later replace with API)
  const firm = {
    id: firmId,
    name: "Alpha Corp",
    vendors: 24,
    health: 92,
  }

  if (!firm) return null

  return (
    <div className="max-w-300 mx-auto px-4 py-6 space-y-6">

      <h1 className="text-2xl font-semibold">{firm.name}</h1>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>{firm.vendors}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Health Score</CardTitle>
          </CardHeader>
          <CardContent>{firm.health}%</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to={`/firm/${firmId}/add`}>Add Vendor</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Vendors list comes next */}
    </div>
  )
}
