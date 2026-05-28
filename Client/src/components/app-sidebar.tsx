import * as React from "react"
import {
  IconDashboard,
  IconBuildingStore,
  IconUsers,
  IconHelp,
  IconSettings,
  IconHexagonLetterV
} from "@tabler/icons-react"

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"

// Updated data structure mapping to actual app routes
const data = {
  user: {
    name: "System Admin",
    email: "admin@vendorweave.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Firms",
      url: "/firm",
      icon: IconBuildingStore,
    },
    {
      title: "Vendors",
      url: "/vendors",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "#",
      icon: IconHelp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Try to load user data dynamically if possible, or leave placeholder
  const storedUser = localStorage.getItem("user")
  const userData = storedUser ? JSON.parse(storedUser) : data.user

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <IconHexagonLetterV className="size-5! text-violet-500" />
                <span className="text-base font-bold tracking-tight">VendorWeave</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Core routing sections */}
        <NavMain items={data.navMain} />
        
        {/* Secondary routes pushed to bottom */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
