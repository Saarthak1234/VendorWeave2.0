import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { apiGet, apiPatch } from "../../../../lib/api"
import { toast } from "sonner"
import { useFirm } from "../../../../context/FirmContext"

export default function EditVendorPage() {
  const { vendorId } = useParams()
  const navigate = useNavigate()
  const { activeFirm } = useFirm()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    vendorName: "",
    healthScore: "",
    points: "",
  })

  // Load vendor data on mount
  useEffect(() => {
    const loadVendorData = async () => {
      if (!activeFirm || !vendorId) return;
      try {
        // We fetch all vendors and find the one we are editing
        const res = await apiGet(`/firm/${activeFirm.id}/get-all-vendors`)
        const data = await res.json()
        if (res.ok && data.vendors) {
          const vendor = data.vendors.find((v: any) => v._id === vendorId)
          if (vendor) {
            setFormData({
              vendorName: vendor.vendorName,
              healthScore: vendor.healthScore,
              points: vendor.points || vendor.totalPoints || 0
            })
          }
        }
      } catch (err) {
        console.error("Failed to load vendor", err)
      } finally {
        setLoading(false)
      }
    }

    loadVendorData()
  }, [vendorId, activeFirm])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.vendorName.trim()) {
      setError("Vendor name is required")
      return false
    }
    if (formData.healthScore === "" || isNaN(Number(formData.healthScore))) {
      setError("Health score is required and must be a number")
      return false
    }
    if (formData.points === "" || isNaN(Number(formData.points))) {
      setError("Points are required and must be a number")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      if (!activeFirm) throw new Error("No active firm selected");

      const res = await apiPatch(`/firm/${activeFirm.id}/update-vendor`, {
        vendorId,
        vendorName: formData.vendorName,
        healthScore: Number(formData.healthScore),
        points: Number(formData.points)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to update vendor")
      }

      setSuccess(true)
      toast.success("Vendor updated successfully!")

      setTimeout(() => {
        navigate(`/vendors/${vendorId}`)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  if (!vendorId) {
    return (
      <div>
        <p className="text-red-600">Invalid vendor selected</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Edit Vendor</h1>
          <p className="text-muted-foreground">Loading vendor details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Edit Vendor</h1>
        <p className="text-muted-foreground">
          Update information for <span className="font-medium">{formData.vendorName || 'Vendor'}</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-100 p-4 text-red-800">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-100 p-4 text-green-800">
                ✓ Vendor updated successfully! Redirecting...
              </div>
            )}

            {/* Vendor Name */}
            <div className="space-y-2">
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input
                id="vendorName"
                name="vendorName"
                placeholder="e.g., Acme Supplies"
                value={formData.vendorName}
                onChange={handleChange}
                required
                disabled={submitting || success}
              />
            </div>

            {/* Health Score */}
            <div className="space-y-2">
              <Label htmlFor="healthScore">Health Score *</Label>
              <Input
                id="healthScore"
                name="healthScore"
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 85"
                value={formData.healthScore}
                onChange={handleChange}
                required
                disabled={submitting || success}
              />
            </div>

            {/* Points */}
            <div className="space-y-2">
              <Label htmlFor="points">Points *</Label>
              <Input
                id="points"
                name="points"
                type="number"
                min="0"
                placeholder="e.g., 420"
                value={formData.points}
                onChange={handleChange}
                required
                disabled={submitting || success}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={submitting || success}
                className="flex-1"
              >
                {submitting ? "Saving Changes..." : success ? "✓ Changes Saved" : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/vendors/${vendorId}`)}
                disabled={submitting || success}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
