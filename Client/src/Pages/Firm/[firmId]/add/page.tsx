import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useFirm } from "../../../../context/FirmContext"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"

export default function AddVendorPage() {
  const { firmId } = useParams()
  const navigate = useNavigate()
  const { activeFirm } = useFirm()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    category: "supplier",
    notes: "",
  })

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
      category: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Vendor name is required")
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

    setLoading(true)

    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful response
      console.log("Vendor created:", {
        ...formData,
        firmId,
        id: `v${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      })

      setSuccess(true)

      // Redirect after 1 second to show success message
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
      <div className="max-w-xl mx-auto px-4 py-6">
        <p className="text-red-600">Invalid firm selected</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
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
              <Label htmlFor="name">Vendor Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Acme Supplies Inc."
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading || success}
              />
            </div>

            {/* Contact Person */}
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                placeholder="e.g., John Smith"
                value={formData.contactPerson}
                onChange={handleChange}
                disabled={loading || success}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vendor@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading || success}
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
                disabled={loading || success}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Business Ave, City, State 12345"
                value={formData.address}
                onChange={handleChange}
                disabled={loading || success}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={handleSelectChange} 
                disabled={loading || success}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="manufacturer">Manufacturer</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="service-provider">Service Provider</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Additional information about the vendor..."
                value={formData.notes}
                onChange={handleChange}
                disabled={loading || success}
                className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
