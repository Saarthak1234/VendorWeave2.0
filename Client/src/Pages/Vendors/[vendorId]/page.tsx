import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"

type Query = {
  id: string
  name: string
  date: string
  scoreImpact: number
}

type Vendor = {
  id: string
  name: string
  firm: string
  health: number
  points: number
  queries: Query[]
}

export default function VendorDetailsPage() {
  const { vendorId } = useParams()
  const navigate = useNavigate()

  // Mock vendor data - map each vendor ID to its data
  const vendorDataMap: Record<string, Vendor> = {
    v1: {
      id: "v1",
      name: "Vendor Alpha",
      firm: "Alpha Corp",
      health: 82,
      points: 420,
      queries: [
        {
          id: "q1",
          name: "Q1 Performance Check",
          date: "2024-12-20",
          scoreImpact: +5,
        },
        {
          id: "q2",
          name: "Q2 Compliance Review",
          date: "2024-12-15",
          scoreImpact: -2,
        },
        {
          id: "q3",
          name: "Q3 Delivery Assessment",
          date: "2024-12-10",
          scoreImpact: +8,
        },
      ],
    },
    v2: {
      id: "v2",
      name: "Vendor Beta",
      firm: "Nimbus Ltd",
      health: 75,
      points: 380,
      queries: [
        {
          id: "q4",
          name: "Q1 Service Review",
          date: "2024-12-19",
          scoreImpact: +3,
        },
        {
          id: "q5",
          name: "Q2 Reliability Check",
          date: "2024-12-14",
          scoreImpact: -1,
        },
        {
          id: "q6",
          name: "Q3 Support Quality",
          date: "2024-12-09",
          scoreImpact: +6,
        },
      ],
    },
    v3: {
      id: "v3",
      name: "Vendor Gamma",
      firm: "Orion Group",
      health: 88,
      points: 450,
      queries: [
        {
          id: "q7",
          name: "Q1 Production Check",
          date: "2024-12-21",
          scoreImpact: +7,
        },
        {
          id: "q8",
          name: "Q2 Quality Audit",
          date: "2024-12-16",
          scoreImpact: +4,
        },
        {
          id: "q9",
          name: "Q3 Efficiency Review",
          date: "2024-12-11",
          scoreImpact: +9,
        },
      ],
    },
    v4: {
      id: "v4",
      name: "Vendor Delta",
      firm: "Vertex Inc",
      health: 68,
      points: 320,
      queries: [
        {
          id: "q10",
          name: "Q1 Delivery Check",
          date: "2024-12-18",
          scoreImpact: +2,
        },
        {
          id: "q11",
          name: "Q2 Logistics Review",
          date: "2024-12-13",
          scoreImpact: -3,
        },
        {
          id: "q12",
          name: "Q3 Performance Check",
          date: "2024-12-08",
          scoreImpact: +1,
        },
      ],
    },
  }

  // Get vendor data based on vendorId, default to v1 if not found
  const vendor = vendorDataMap[vendorId || "v1"] || vendorDataMap.v1
  const queries = vendor.queries

  // Validate vendor ID
  if (!vendorId) {
    return (
      <div className="max-w-300 mx-auto px-4 py-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">❌ Error: No vendor selected</p>
            <p className="text-sm text-red-500 mt-2">Please select a valid vendor from the list</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/vendors")}
            >
              Back to Vendors List
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if vendor exists in our data
  if (!vendorDataMap[vendorId]) {
    return (
      <div className="max-w-300 mx-auto px-4 py-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">❌ Error: Vendor not found</p>
            <p className="text-sm text-red-500 mt-2">The vendor ID "{vendorId}" does not exist in the system</p>
            <p className="text-sm text-red-500">Valid vendors: v1, v2, v3, v4</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/vendors")}
            >
              Back to Vendors List
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-300 mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{vendor.name}</h1>
            <p className="text-muted-foreground">{vendor.firm}</p>
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate(`/vendors/${vendorId}/edit`)}
            >
              Edit Vendor
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate(`/vendors/${vendorId}/add-query`)}
            >
              Add Query
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate(`/vendors/${vendorId}/import-csv`)}
            >
              Import CSV
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                {vendor.health}%
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Points</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{vendor.points}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="queries">Queries</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Health Score</p>
                  <p className="text-2xl font-semibold">{vendor.health}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-semibold">{vendor.points}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Firm</p>
                  <p className="font-medium">{vendor.firm}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <p className="text-muted-foreground">
            Charts and detailed stats coming soon
          </p>
        </TabsContent>

        {/* Queries Tab */}
        <TabsContent value="queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Query History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {queries.length > 0 ? (
                  queries.map((query: Query) => (
                    <div
                      key={query.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1 flex-1">
                        <p className="font-medium">{query.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {query.date}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge
                          className={
                            query.scoreImpact > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {query.scoreImpact > 0 ? "+" : ""}
                          {query.scoreImpact}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No queries yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Activity tracking coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
