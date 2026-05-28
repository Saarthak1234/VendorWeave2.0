import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useFirm } from "../../../../context/FirmContext"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { apiPost } from "../../../../lib/api"
import { toast } from "sonner"

export default function AddVendorPage() {
  const { firmId } = useParams()
  const navigate = useNavigate()
  const { activeFirm } = useFirm()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    vendorName: "",
    healthScore: "",
    points: "",
  })

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

    console.log(formData);
    

    e.preventDefault()
    setError(null)
    

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const res = await apiPost(`/firm/${firmId}/create-vendor`, {
        vendorName: formData.vendorName,
        healthScore: Number(formData.healthScore),
        points: Number(formData.points)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to create vendor")
      }

      setSuccess(true)
      toast.success("Vendor added successfully!")

      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/firm/${firmId}`)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!firmId || !activeFirm) {
    return (
      <div>
        <p className="text-red-600">Invalid firm selected</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Add Vendor</h1>
        <p className="text-muted-foreground">
          Adding vendor to <span className="font-medium">{activeFirm.name}</span>
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
                ✓ Vendor added successfully! Redirecting...
              </div>
            )}

            {/* Vendor Name */}
            <div className="space-y-2">
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input
                id="vendorName"
                name="vendorName"
                placeholder="e.g., Acme Supplies Inc."
                value={formData.vendorName}
                onChange={handleChange}
                required
                disabled={loading || success}
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
                // required
                disabled={loading || success}
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
                // required
                disabled={loading || success}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading || success}
                className="flex-1"
              >
                {loading ? "Adding Vendor..." : success ? "✓ Vendor Added" : "Add Vendor"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/firm/${firmId}`)}
                disabled={loading || success}
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
