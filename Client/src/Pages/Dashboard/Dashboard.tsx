import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChartAreaInteractive } from "../../components/chart-area-interactive"
import { VendorTable } from "../../components/vendor-table"
import { SectionCards } from "../../components/section-cards"
import { TopVendors } from "../../components/top-vendors"
import { Button } from "../../components/ui/button"
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

export default function Page() {
  const navigate = useNavigate()
  const { activeFirm, firms } = useFirm()
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

  // compute stats
  const totalFirms = firms.length
  const totalVendors = vendors.length
  const avgHealth = totalVendors > 0 
    ? Math.round(vendors.reduce((acc, v) => acc + v.score, 0) / totalVendors) 
    : 0

  return (
    <>
      {/* KPI CARDS */}
      <SectionCards 
        totalFirms={totalFirms} 
        totalVendors={totalVendors} 
        avgHealth={avgHealth} 
      />

      {/* CHART */}
      <div className="rounded-xl border bg-background p-4 lg:p-6 shadow-sm">
        <ChartAreaInteractive />
      </div>

      {/* TOP LISTS */}
      <div className="grid grid-cols-1 gap-6">
        <TopVendors vendors={vendors} />
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-background p-4 lg:p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {activeFirm ? `${activeFirm.name} Vendors` : "All Vendors"}
            </h3>
            <p className="text-sm text-muted-foreground">View and manage vendors for the selected firm.</p>
          </div>
          {activeFirm && (
            <Button onClick={() => navigate(`/firm/${activeFirm.id}/add`)}>
              Add Vendor
            </Button>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center p-8 text-muted-foreground">Loading vendors...</div>
        ) : (
          <VendorTable vendors={vendors} />
        )}
      </div>
    </>
  )
}
