import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"

export default function EditVendorPage() {
  const { vendorId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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
    firmName: "",
  })

  // Load vendor data on mount
  useEffect(() => {
    const loadVendorData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock vendor data based on vendorId
      const mockVendors: Record<string, any> = {
        v1: {
          name: "Vendor Alpha",
          contactPerson: "John Smith",
          email: "john@vendoralpha.com",
          phone: "+1 (555) 111-1111",
          address: "100 Alpha Street, Tech City, CA 94000",
          category: "supplier",
          notes: "Primary supplier for components",
          firmName: "Alpha Corp",
        },
        v2: {
          name: "Vendor Beta",
          contactPerson: "Jane Doe",
          email: "jane@vendorbeta.com",
          phone: "+1 (555) 222-2222",
          address: "200 Beta Avenue, Service City, NY 10001",
          category: "service-provider",
          notes: "Provides maintenance and support",
          firmName: "Nimbus Ltd",
        },
        v3: {
          name: "Vendor Gamma",
          contactPerson: "Mike Johnson",
          email: "mike@vendorgamma.com",
          phone: "+1 (555) 333-3333",
          address: "300 Gamma Way, Supply Town, TX 75001",
          category: "manufacturer",
          notes: "Custom manufacturing solutions",
          firmName: "Orion Group",
        },
        v4: {
          name: "Vendor Delta",
          contactPerson: "Sarah Williams",
          email: "sarah@vendordelta.com",
          phone: "+1 (555) 444-4444",
          address: "400 Delta Road, Distribution Hub, IL 60601",
          category: "distributor",
          notes: "Logistics and distribution partner",
          firmName: "Vertex Inc",
        },
      }

      const vendorData = mockVendors[vendorId || "v1"] || mockVendors.v1
      setFormData(vendorData)
      setLoading(false)
    }

    loadVendorData()
  }, [vendorId])

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

    setSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Vendor updated:", {
        ...formData,
        vendorId,
        updatedAt: new Date().toISOString(),
      })

      setSuccess(true)

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
      <div className="max-w-xl mx-auto px-4 py-6">
        <p className="text-red-600">Invalid vendor selected</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Edit Vendor</h1>
          <p className="text-muted-foreground">Loading vendor details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Edit Vendor</h1>
        <p className="text-muted-foreground">
          Update information for <span className="font-medium">{formData.name}</span>
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
              <Label htmlFor="name">Vendor Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Acme Supplies"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={submitting || success}
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
                placeholder="vendor@example.com"
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

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Business Ave, City, State"
                value={formData.address}
                onChange={handleChange}
                disabled={submitting || success}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={handleSelectChange} 
                disabled={submitting || success}
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

            {/* Firm Name (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="firmName">Firm Name</Label>
              <Input
                id="firmName"
                type="text"
                value={formData.firmName}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">This cannot be changed directly</p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Additional information..."
                value={formData.notes}
                onChange={handleChange}
                disabled={submitting || success}
                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
