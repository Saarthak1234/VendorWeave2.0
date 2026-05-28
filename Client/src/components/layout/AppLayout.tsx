import React from "react"
import { Outlet } from "react-router-dom"
import { AppSidebar } from "../app-sidebar"
import { SiteHeader } from "../site-header"
import { SidebarInset, SidebarProvider } from "../ui/sidebar"

export default function AppLayout({ children }: { children?: React.ReactNode }) {
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
        <main className="flex flex-1 justify-center">
          <div className="w-full max-w-7xl px-4 py-6 space-y-8 lg:px-8">
            {children || <Outlet />}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
