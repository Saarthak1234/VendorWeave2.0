import { createContext, useContext, useEffect, useState } from "react"

type Firm = {
  id: string
  name: string
}

type FirmContextType = {
  activeFirm: Firm | null
  setActiveFirm: (firm: Firm) => void
  firms: Firm[]
}

const FirmContext = createContext<FirmContextType | undefined>(undefined)

export function FirmProvider({ children }: { children: React.ReactNode }) {
  const [activeFirm, setActiveFirmState] = useState<Firm | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock firms - replace with API call later
  const firms: Firm[] = [
    { id: "f1", name: "Alpha Corp" },
    { id: "f2", name: "Nimbus Ltd" },
    { id: "f3", name: "Orion Group" },
    { id: "f4", name: "Vertex Inc" },
  ]

  // Load from localStorage on mount
  useEffect(() => {
    const storedFirm = localStorage.getItem("activeFirm")
    if (storedFirm) {
      try {
        setActiveFirmState(JSON.parse(storedFirm))
      } catch (error) {
        console.error("Failed to parse stored firm:", error)
        // Set default firm if stored data is invalid
        if (firms.length > 0) {
          setActiveFirmState(firms[0])
        }
      }
    } else {
      // Set first firm as default if none stored
      if (firms.length > 0) {
        setActiveFirmState(firms[0])
      }
    }
    setLoading(false)
  }, [])

  const setActiveFirm = (firm: Firm) => {
    setActiveFirmState(firm)
    localStorage.setItem("activeFirm", JSON.stringify(firm))
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <FirmContext.Provider value={{ activeFirm, setActiveFirm, firms }}>
      {children}
    </FirmContext.Provider>
  )
}

export function useFirm() {
  const context = useContext(FirmContext)
  if (!context) {
    throw new Error("useFirm must be used within FirmProvider")
  }
  return context
}
