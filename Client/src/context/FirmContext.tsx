import { createContext, useContext, useEffect, useState } from "react"
import { apiGet } from "@/lib/api"

type Firm = {
  id: string
  name: string
}

type FirmContextType = {
  activeFirm: Firm | null
  setActiveFirm: (firm: Firm | null) => void
  firms: Firm[]
  loading: boolean
  refreshFirms: () => Promise<void>
}

const FirmContext = createContext<FirmContextType | undefined>(undefined)

export function FirmProvider({ children }: { children: React.ReactNode }) {
  const [activeFirm, setActiveFirmState] = useState<Firm | null>(null)
  const [firms, setFirms] = useState<Firm[]>([])
  const [loading, setLoading] = useState(true)

  const refreshFirms = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setFirms([])
      setActiveFirmState(null)
      setLoading(false)
      return
    }

    try {
      const response = await apiGet("/firm/get-firms")
      const data = await response.json()

      if (response.ok && data.firms) {
        const mappedFirms = data.firms.map((f: any) => ({
          id: f._id,
          name: f.firmName,
        }))
        setFirms(mappedFirms)

        // Check if there is an active firm stored
        const storedFirm = localStorage.getItem("activeFirm")
        if (storedFirm) {
          try {
            const parsed = JSON.parse(storedFirm)
            // Verify if stored firm still exists in fetched firms
            const exists = mappedFirms.some((f: Firm) => f.id === parsed.id)
            if (exists) {
              setActiveFirmState(parsed)
            } else {
              // Select first as fallback
              const fallback = mappedFirms[0] || null
              setActiveFirm(fallback)
            }
          } catch (e) {
            const fallback = mappedFirms[0] || null
            setActiveFirm(fallback)
          }
        } else {
          // Select first as fallback
          const fallback = mappedFirms[0] || null
          setActiveFirm(fallback)
        }
      } else {
        // e.g. 400 "No firms registered for this admin"
        setFirms([])
        setActiveFirm(null)
      }
    } catch (error) {
      console.error("Failed to load firms in FirmProvider:", error)
      setFirms([])
      setActiveFirm(null)
    } finally {
      setLoading(false)
    }
  }

  // Load from backend on mount (or token change)
  useEffect(() => {
    refreshFirms()
  }, [])

  const setActiveFirm = (firm: Firm | null) => {
    setActiveFirmState(firm)
    if (firm) {
      localStorage.setItem("activeFirm", JSON.stringify(firm))
    } else {
      localStorage.removeItem("activeFirm")
    }
  }

  return (
    <FirmContext.Provider value={{ activeFirm, setActiveFirm, firms, loading, refreshFirms }}>
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

