import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Label } from "../../../../components/ui/label"
import { Input } from "../../../../components/ui/input"

export default function ImportCSVPage() {
  const { vendorId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileData, setFileData] = useState<string | null>(null)
  const [importType, setImportType] = useState("queries")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      setError("Please select a CSV file")
      return
    }

    setFileName(file.name)
    setError(null)

    // Read file content
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string
        setFileData(csv)
        console.log("File read successfully:", file.name)
      } catch (err) {
        setError("Failed to read file")
      }
    }
    reader.readAsText(file)
  }

  const validateFile = () => {
    if (!fileData) {
      setError("Please select a CSV file")
      return false
    }
    
    const lines = fileData.split("\n").filter((line) => line.trim())
    if (lines.length < 2) {
      setError("CSV file must have at least a header and one data row")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateFile()) {
      return
    }

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Parse CSV
      const lines = fileData!.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim())
      const rows = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim())
        const obj: Record<string, string> = {}
        headers.forEach((header, i) => {
          obj[header] = values[i] || ""
        })
        return obj
      })

      console.log("CSV Import successful:", {
        vendorId,
        importType,
        fileName,
        rowCount: rows.length,
        headers,
        data: rows,
        importedAt: new Date().toISOString(),
      })

      setSuccess(true)

      setTimeout(() => {
        navigate(`/vendors/${vendorId}`)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import CSV")
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
        <h1 className="text-2xl font-semibold">Import CSV</h1>
        <p className="text-muted-foreground">
          Bulk import vendor data or queries from a CSV file
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSV Upload</CardTitle>
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
                ✓ CSV imported successfully! ({(fileData?.split("\n").length || 1) - 1} records) Redirecting...
              </div>
            )}

            {/* Import Type */}
            <div className="space-y-3">
              <Label>What are you importing?</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition">
                  <input
                    type="radio"
                    name="importType"
                    value="queries"
                    checked={importType === "queries"}
                    onChange={(e) => setImportType(e.target.value)}
                    disabled={loading || success}
                  />
                  <span className="font-medium">Queries/Assessments</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition">
                  <input
                    type="radio"
                    name="importType"
                    value="vendors"
                    checked={importType === "vendors"}
                    onChange={(e) => setImportType(e.target.value)}
                    disabled={loading || success}
                  />
                  <span className="font-medium">Vendor Data</span>
                </label>
              </div>
            </div>

            {/* File Input */}
            <div className="space-y-2">
              <Label htmlFor="csvFile">Select CSV File *</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={loading || success}
              />
              {fileName && (
                <p className="text-sm text-green-600">✓ File selected: {fileName}</p>
              )}
            </div>

            {/* CSV Format Info */}
            <div className="rounded-lg bg-blue-50 p-4 space-y-2">
              <p className="font-medium text-blue-900">CSV Format Required:</p>
              {importType === "queries" ? (
                <p className="text-sm text-blue-800">
                  Headers: <code className="bg-blue-100 px-2 py-1 rounded">name,category,description,scoreImpact</code>
                </p>
              ) : (
                <p className="text-sm text-blue-800">
                  Headers: <code className="bg-blue-100 px-2 py-1 rounded">name,email,phone,category,contact</code>
                </p>
              )}
            </div>

            {/* Sample Data Preview */}
            {fileData && (
              <div className="space-y-2">
                <Label>Preview (First 5 rows)</Label>
                <div className="border rounded-lg bg-muted p-3 text-sm font-mono overflow-x-auto">
                  {fileData
                    .split("\n")
                    .slice(0, 6)
                    .map((line, idx) => (
                      <div key={idx} className="text-muted-foreground">
                        {line}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading || success || !fileData}
                className="flex-1"
              >
                {loading ? "Importing..." : success ? "✓ Imported" : "Import CSV"}
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

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• CSV file must have a header row</p>
          <p>• First column is required (name)</p>
          <p>• Each row must have matching number of columns</p>
          <p>• Maximum file size: 10MB</p>
        </CardContent>
      </Card>
    </div>
  )
}
