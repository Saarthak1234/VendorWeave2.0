import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useFirm } from "../../../../context/FirmContext"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"

export default function EditFirmPage() {
  const { firmId } = useParams()
  const navigate = useNavigate()
  const { activeFirm } = useFirm()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "manufacturing",
    location: "",
    phone: "",
    email: "",
    website: "",
    vendorCount: 0,
  })

  // Load firm data on mount
  useEffect(() => {
    // Simulate loading firm data
    const loadFirmData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock firm data - replace with actual data when backend is ready
      const mockFirmData = {
        name: activeFirm?.name || "Alpha Corp",
        description: "Leading supplier of industrial materials",
        industry: "manufacturing",
        location: "San Francisco, CA",
        phone: "+1 (555) 123-4567",
        email: "info@alphacorp.com",
        website: "www.alphacorp.com",
        vendorCount: 24,
      }

      setFormData(mockFirmData)
      setLoading(false)
    }

    loadFirmData()
  }, [firmId, activeFirm])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      industry: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Firm name is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address")
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
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful response
      console.log("Firm updated:", {
        ...formData,
        firmId,
        updatedAt: new Date().toISOString(),
      })

      setSuccess(true)

      // Redirect after 1 second to show success message
      setTimeout(() => {
        navigate(`/firm/${firmId}`)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  if (!firmId || !activeFirm) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <p className="text-red-600">Invalid firm selected</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Edit Firm</h1>
          <p className="text-muted-foreground">Loading firm details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Edit Firm</h1>
        <p className="text-muted-foreground">
          Update information for <span className="font-medium">{activeFirm.name}</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Firm Information</CardTitle>
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
                ✓ Firm updated successfully! Redirecting...
              </div>
            )}

            {/* Firm Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Firm Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Acme Corporation"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={submitting || success}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Brief description of the firm..."
                value={formData.description}
                onChange={handleChange}
                disabled={submitting || success}
                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={formData.industry} 
                onValueChange={handleSelectChange} 
                disabled={submitting || success}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., San Francisco, CA"
                value={formData.location}
                onChange={handleChange}
                disabled={submitting || success}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contact@firm.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={submitting || success}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                disabled={submitting || success}
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="www.example.com"
                value={formData.website}
                onChange={handleChange}
                disabled={submitting || success}
              />
            </div>

            {/* Vendor Count (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="vendorCount">Total Vendors</Label>
              <Input
                id="vendorCount"
                type="number"
                value={formData.vendorCount}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">This value is managed automatically</p>
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
                onClick={() => navigate(`/firm/${firmId}`)}
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
