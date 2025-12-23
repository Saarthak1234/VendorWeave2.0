import { AppSidebar } from "../../components/app-sidebar"
import { ChartAreaInteractive } from "../../components/chart-area-interactive"
import { DataTable } from "../../components/data-table"
import { SectionCards } from "../../components/section-cards"
import { SiteHeader } from "../../components/site-header"
import { TopFirms } from "../../components/top-firms"
import { TopVendors } from "../../components/top-vendors"

import {
  SidebarInset,
  SidebarProvider,
} from "../../components/ui/sidebar"

import data from "../../app/dashboard/data.json"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />

        {/* MAIN DASHBOARD CONTENT */}
        <main className="flex flex-1 justify-center">
          <div className="w-full max-w-350 px-4 py-6 space-y-8 lg:px-6">

            {/* KPI CARDS */}
            <SectionCards />

            {/* CHART */}
            <div className="rounded-xl border bg-background p-4 lg:p-6">
              <ChartAreaInteractive />
            </div>

            {/* TOP LISTS */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <TopFirms />
              <TopVendors />
            </div>

            {/* TABLE */}
            <div className="rounded-xl border bg-background p-4 lg:p-6">
              <DataTable data={data} />
            </div>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
