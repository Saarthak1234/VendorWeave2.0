import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"

export default function AddQueryPage() {
  const { vendorId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "performance",
    scoreImpact: "positive",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Query name is required")
      return false
    }
    if (!formData.description.trim()) {
      setError("Description is required")
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

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const scoreValue = formData.scoreImpact === "positive" ? Math.floor(Math.random() * 10) + 1 : -(Math.floor(Math.random() * 5) + 1)

      console.log("Query added:", {
        ...formData,
        vendorId,
        scoreImpact: scoreValue,
        createdAt: new Date().toISOString(),
        id: `q${Math.random().toString(36).substr(2, 9)}`,
      })

      setSuccess(true)

      setTimeout(() => {
        navigate(`/vendors/${vendorId}`)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!vendorId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <p className="text-red-600">Invalid vendor selected</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Add Query</h1>
        <p className="text-muted-foreground">
          Create a new assessment or query for vendor evaluation
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Query Details</CardTitle>
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
                ✓ Query added successfully! Redirecting...
              </div>
            )}

            {/* Query Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Query Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Q4 Performance Assessment"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading || success}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Detailed description of the query or assessment..."
                value={formData.description}
                onChange={handleChange}
                disabled={loading || success}
                className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange("category", value)}
                disabled={loading || success}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="cost">Cost</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Score Impact */}
            <div className="space-y-2">
              <Label htmlFor="scoreImpact">Score Impact</Label>
              <Select 
                value={formData.scoreImpact} 
                onValueChange={(value) => handleSelectChange("scoreImpact", value)}
                disabled={loading || success}
              >
                <SelectTrigger id="scoreImpact">
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive (+1 to +10 points)</SelectItem>
                  <SelectItem value="negative">Negative (-1 to -5 points)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Any additional information..."
                value={formData.notes}
                onChange={handleChange}
                disabled={loading || success}
                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading || success}
                className="flex-1"
              >
                {loading ? "Adding Query..." : success ? "✓ Query Added" : "Add Query"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/vendors/${vendorId}`)}
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
