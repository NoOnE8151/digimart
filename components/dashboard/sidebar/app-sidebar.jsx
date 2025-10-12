"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  PanelsTopLeft,
  PackageSearch,
  Store,
  ShoppingCart,
  FolderDown,
  LifeBuoy,
  Send,
  Settings2,
  CircleDollarSign
} from "lucide-react"

import { NavMain } from "@/components/dashboard/sidebar/nav-main"
import { NavSecondary } from "@/components/dashboard/sidebar/nav-secondary"
import { NavUser } from "@/components/dashboard/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"

const navMain = [
  {
    title: "Overview",
    icon: PanelsTopLeft,
    url: '/dashboard',
    isActive: true,
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: PackageSearch,
  },
  {
    title: "Shop",
    url: "/dashboard/shop",
    icon: Store,
  },
  {
    title: "Payouts",
    url: "/dashboard/payout",
    icon: CircleDollarSign,
  },{
    title: "Marketplace",
    url: "/marketplace",
    icon: ShoppingCart
  },{
    title: "My Orders",
    url: "/dashboard/library",
    icon: FolderDown
  }
]

const navSecondary = [
  {
    title: "Feedback",
    url: "#",
    icon: Send,
  },
]

export function AppSidebar(props) {
  const { user } = useUser();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: '',
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.primaryEmailAddress?.emailAddress || '',
        avatar: user.imageUrl || '',
      });
    }
  }, [user]);

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/" >
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
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
