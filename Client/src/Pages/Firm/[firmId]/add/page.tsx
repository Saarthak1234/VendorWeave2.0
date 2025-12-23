import { useParams } from "react-router-dom"

export default function AddVendorPage() {
  const { firmId } = useParams()

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-semibold">
        Add Vendor to Firm {firmId}
      </h1>

      {/* Form comes later */}
      <p className="text-muted-foreground">
        Vendor creation form will go here.
      </p>
    </div>
  )
}
