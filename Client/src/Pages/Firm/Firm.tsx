import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Plus, Check, Landmark, Loader2 } from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { useFirm } from "../../context/FirmContext"
import { apiPost } from "../../lib/api"

export default function Firms() {
  const navigate = useNavigate()
  const { firms, activeFirm, setActiveFirm, refreshFirms } = useFirm()
  const [newFirmName, setNewFirmName] = useState("")
  const [creating, setCreating] = useState(false)

  const handleCreateFirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFirmName.trim()) {
      toast.error("Please enter a firm name")
      return
    }

    setCreating(true)
    try {
      const response = await apiPost("/firm/create-firm", { name: newFirmName })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create firm")
      }

      toast.success(`Firm "${newFirmName}" successfully created!`)
      setNewFirmName("")
      await refreshFirms() // reload list
    } catch (error: any) {
      console.error("Create firm error:", error)
      toast.error(error.message || "Error creating firm")
    } finally {
      setCreating(false)
    }
  }

  const handleSelectFirm = (firm: any) => {
    setActiveFirm(firm)
    toast.success(`Active workspace switched to: ${firm.name}`)
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b pb-6 border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Workspaces & Firms
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create or select a firm to manage its vendors, evaluate performance, and run queries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left/Main Column: Firm List */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-slate-200/60 dark:border-slate-800/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Landmark className="h-5 w-5 text-violet-500" />
                All Registered Firms
              </CardTitle>
              <CardDescription>
                Select a firm to load its specific dashboard and vendor profiles.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {firms.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg border-slate-200 dark:border-slate-800">
                  <Landmark className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No Firms Registered</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                    You haven't added any firms to your profile yet. Create a new firm on the right to get started!
                  </p>
                </div>
              ) : (
                firms.map((firm) => {
                  const isActive = activeFirm?.id === firm.id
                  return (
                    <div
                      key={firm.id}
                      className={`flex items-center justify-between rounded-xl border p-5 transition-all duration-200 ${
                        isActive
                          ? "border-violet-500 bg-violet-500/5 dark:bg-violet-500/10 shadow-sm"
                          : "border-slate-100 hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-700 bg-background/50"
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-base flex items-center gap-2">
                          {firm.name}
                          {isActive && (
                            <Badge className="bg-violet-600 hover:bg-violet-500 text-white font-medium gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 border-0">
                              <Check className="h-3 w-3 shrink-0" />
                              Active
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: <span className="font-mono">{firm.id}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {!isActive ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSelectFirm(firm)}
                            className="font-semibold cursor-pointer border-slate-200 dark:border-slate-700"
                          >
                            Select Workspace
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => navigate(`/dashboard`)}
                            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold cursor-pointer"
                          >
                            Open Dashboard
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Creation panel */}
        <div className="space-y-6">
          <Card className="border border-slate-200/60 dark:border-slate-800/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold">New Firm</CardTitle>
              <CardDescription>
                Register a new corporate entity or subsidiary under your administrator account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateFirm} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="firm-name" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Firm Name
                  </label>
                  <Input
                    type="text"
                    id="firm-name"
                    value={newFirmName}
                    onChange={(e) => setNewFirmName(e.target.value)}
                    placeholder="e.g. Global Logistics Inc"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={creating || !newFirmName.trim()}
                  className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-semibold cursor-pointer hover:bg-slate-800 dark:hover:bg-slate-100 flex items-center justify-center gap-1.5 py-5"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Firm
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

