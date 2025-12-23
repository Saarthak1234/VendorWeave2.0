import { useParams } from "react-router-dom"

export default function EditFirmPage() {
  const { firmId } = useParams()

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-semibold">
        Edit Firm {firmId}
      </h1>

      <p className="text-muted-foreground">
        Firm edit form will go here.
      </p>
    </div>
  )
}
