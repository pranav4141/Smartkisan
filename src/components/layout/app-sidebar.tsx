"use client"

import {
  LayoutDashboard,
  Droplets,
  Sprout,
  ScanLine,
  TrendingUp,
  Users,
  User,
  Settings
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { useFarming } from "@/context/farming-context"

export function AppSidebar() {
  const pathname = usePathname()
  const { t } = useFarming()

  const mainNav = [
    { title: t.dashboard, icon: LayoutDashboard, href: "/" },
    { title: t.irrigation, icon: Droplets, href: "/irrigation" },
    { title: t.cropAdvisory, icon: Sprout, href: "/advisory" },
    { title: t.diseaseDetection, icon: ScanLine, href: "/disease-detection" },
    { title: t.marketPrices, icon: TrendingUp, href: "/market" },
    { title: t.community, icon: Users, href: "/community" },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-6 flex flex-row items-center gap-2 px-4">
        <div className="bg-primary p-2 rounded-lg">
          <Sprout className="text-white h-6 w-6" />
        </div>
        <span className="font-headline font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden">
          SmartKisan
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">{t.farmingAssistant}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={t.profile} isActive={pathname === "/profile"}>
              <Link href="/profile">
                <User />
                <span>{t.profile}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={t.settings} isActive={pathname === "/settings"}>
              <Link href="/settings">
                <Settings />
                <span>{t.settings}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
