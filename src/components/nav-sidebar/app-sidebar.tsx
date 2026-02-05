import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'

import { navItems } from './nav-data'
import { SearchBar } from './search-bar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AppSidebar({
  pathname,
  ...props
}: React.ComponentProps<typeof Sidebar> & { pathname: string }) {
  return (
    <Sidebar collapsible="icon" {...props} className="pt-4">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[slot=sidebar-menu-button]:!p-1"
            >
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="size-10   object-contain"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-base">
                  Dashboard Presensi
                </span>
                <span className="truncate font-bold text-base">
                  KPRI Bina Sejahtera
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SearchBar className="sm:hidden block" />
              </SidebarMenuItem>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.url || pathname.startsWith(`${item.url}/`)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className="h-12 font-medium hover:bg-slate-100 data-[active=true]:bg-slate-900 data-[active=true]:text-white data-[active=true]:hover:bg-slate-800 data-[active=true]:hover:text-white"
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="group-data-[collapsible=icon]:!p-1 hover:bg-slate-100"
            >
              <Link to="/profile">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border">
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src="/office.png"
                      alt="User"
                      className="object-cover"
                    />
                    <AvatarFallback>AH</AvatarFallback>
                  </Avatar>
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">
                    Afif Habiburrohman
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    afif@example.com
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white group-data-[collapsible=icon]:!p-2.5"
            >
              <Link to="/dashboard">
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">
                  Log out
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
