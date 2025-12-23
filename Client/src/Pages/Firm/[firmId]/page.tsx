import { useParams, Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"

type Firm = {
  id: string
  name: string
  vendors: number
  health: number
  description?: string
  location?: string
}

export default function FirmDetailsPage() {
  const { firmId } = useParams()
  const navigate = useNavigate()

  // Mock firm data - map each firm ID to its data
  const firmDataMap: Record<string, Firm> = {
    f1: {
      id: "f1",
      name: "Alpha Corp",
      vendors: 24,
      health: 92,
      description: "Leading provider of industrial solutions",
      location: "San Francisco, CA",
    },
    f2: {
      id: "f2",
      name: "Nimbus Ltd",
      vendors: 18,
      health: 88,
      description: "Cloud services and digital infrastructure",
      location: "Seattle, WA",
    },
    f3: {
      id: "f3",
      name: "Orion Group",
      vendors: 31,
      health: 85,
      description: "Manufacturing and logistics partner",
      location: "Chicago, IL",
    },
    f4: {
      id: "f4",
      name: "Vertex Inc",
      vendors: 12,
      health: 81,
      description: "Enterprise software and consulting",
      location: "Boston, MA",
    },
  }

  // Get firm data based on firmId
  const firm = firmDataMap[firmId || "f1"]

  // Validate firm ID
  if (!firmId) {
    return (
      <div className="max-w-300 mx-auto px-4 py-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">❌ Error: No firm selected</p>
            <p className="text-sm text-red-500 mt-2">Please select a valid firm from the list</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/firm")}
            >
              Back to Firms List
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if firm exists in our data
  if (!firmDataMap[firmId]) {
    return (
      <div className="max-w-300 mx-auto px-4 py-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">❌ Error: Firm not found</p>
            <p className="text-sm text-red-500 mt-2">The firm ID "{firmId}" does not exist in the system</p>
            <p className="text-sm text-red-500">Valid firms: f1, f2, f3, f4</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/firm")}
            >
              Back to Firms List
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!firm) return null

  return (
    <div className="max-w-300 mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{firm.name}</h1>
        {firm.location && (
          <p className="text-muted-foreground">{firm.location}</p>
        )}
        {firm.description && (
          <p className="text-sm text-muted-foreground">{firm.description}</p>
        )}
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{firm.vendors}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{firm.health}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link to={`/firm/${firmId}/add`}>Add Vendor</Link>
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(`/firm/${firmId}/edit`)}
            >
              Edit Firm
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Vendors list comes next */}
    </div>
  )
}
