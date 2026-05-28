import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

type Vendor = {
  id: string
  name: string
  firm: string
  score: number
  points: number
}

export function VendorTable({ vendors = [] }: { vendors: Vendor[] }) {
  const navigate = useNavigate()

  if (!vendors || vendors.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 border-dashed border-2 rounded-lg text-muted-foreground">
        No vendors available. Add a vendor to get started.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor Name</TableHead>
            <TableHead>Firm</TableHead>
            <TableHead className="text-right">Health Score</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell className="font-medium">{vendor.name}</TableCell>
              <TableCell>{vendor.firm}</TableCell>
              <TableCell className="text-right">
                <Badge
                  variant="secondary"
                  className={
                    vendor.score >= 80
                      ? "bg-green-100 text-green-800"
                      : vendor.score >= 50
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {vendor.score}%
                </Badge>
              </TableCell>
              <TableCell className="text-right">{vendor.points}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/vendors/${vendor.id}`)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
