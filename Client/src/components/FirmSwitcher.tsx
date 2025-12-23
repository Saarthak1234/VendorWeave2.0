import { useFirm } from "../context/FirmContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export function FirmSwitcher() {
  const { activeFirm, setActiveFirm, firms } = useFirm()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Firm:</span>
      <Select
        value={activeFirm?.id || ""}
        onValueChange={(firmId) => {
          const firm = firms.find((f) => f.id === firmId)
          if (firm) {
            setActiveFirm(firm)
          }
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select a firm" />
        </SelectTrigger>
        <SelectContent>
          {firms.map((firm) => (
            <SelectItem key={firm.id} value={firm.id}>
              {firm.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
