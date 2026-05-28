import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { useFirm } from "../../context/FirmContext"
import { apiGet } from "../../lib/api"
import { toast } from "sonner"

type Vendor = {
  id: string
  name: string
  firm: string
  score: number
  points: number
}

export default function Vendors() {
  const navigate = useNavigate()
  const { activeFirm } = useFirm()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchVendors() {
      if (!activeFirm) {
        setVendors([])
        return
      }
      setLoading(true)
      try {
        const res = await apiGet(`/firm/${activeFirm.id}/get-all-vendors`)
        const data = await res.json()
        if (res.ok && data.vendors) {
          const mapped = data.vendors.map((v: any) => ({
            id: v._id,
            name: v.vendorName,
            firm: activeFirm.name,
            score: v.healthScore || 0,
            points: v.points || 0
          }))
          setVendors(mapped)
        } else {
          setVendors([])
        }
      } catch (err) {
        console.error(err)
        toast.error("Failed to load vendors")
      } finally {
        setLoading(false)
      }
    }
    fetchVendors()
  }, [activeFirm])

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-800"
    if (score >= 75) return "bg-blue-100 text-blue-800"
    if (score >= 65) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {activeFirm ? `${activeFirm.name} Vendors` : "All Vendors"}
          </CardTitle>
          {activeFirm && (
            <Button onClick={() => navigate(`/firm/${activeFirm.id}/add`)}>
              Add Vendor
            </Button>
          )}
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground p-8">Loading vendors...</div>
            ) : vendors.length === 0 ? (
              <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                No vendors found. Add a vendor to get started.
              </div>
            ) : (
              vendors.map((vendor) => (
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}