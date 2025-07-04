"use client"

import * as React from "react"
import {
  PanelsTopLeft,
  PackageSearch,
  Store,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
   CircleDollarSign,  
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "No OnE",
    email: "lomash265@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "#",
      icon: PanelsTopLeft,
      isActive: true,
      items: [
        {
          title: "Earnings",
          url: "#",
        },
        {
          title: "Sales",
          url: "#",
        },
        {
          title: "Top Products",
          url: "#",
        },
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: PackageSearch,
      items: [
        {
          title: "Manage",
          url: "#",
        }
      ],
    },
    {
      title: "Shop",
      url: "#",
      icon: Store,
      items: [
        {
          title: "View Store",
          url: "#",
        },
        {
          title: "Customize",
          url: "#",
        }, {
          title: "Themes",
          url: "#"
        }
      ],
    },{
      title: "Payouts",
      url: "#",
      icon: CircleDollarSign,
      items: [{
        title: "History",
        url: "#"
      }]
    },{
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "#",
        }
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <img src="/assets/logo/logo.png" alt="logo" className="w-[2.5rem]" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-semibold">Digimart</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
