import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router'
import { AppSidebar } from '@/components/nav-sidebar/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { navItems } from '@/components/nav-sidebar/nav-data'
import { SearchBar } from '@/components/nav-sidebar/search-bar'
import { UserNav } from '@/components/nav-sidebar/user-nav'
import Notifications from '@/components/nav-sidebar/notifications'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '18rem',
          '--sidebar-width-icon': '5rem',
        } as React.CSSProperties
      }
    >
      <AppSidebar pathname={pathname} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
          <SidebarTrigger />
          <h1 className="font-bold text-md">
            {navItems.find((item) => item.url === pathname)?.title}
          </h1>
          <SearchBar className="mx-auto max-w-xl hidden md:block" />
          
          <div className='flex items-center gap-2 ml-auto'>
          <Notifications />
          <UserNav />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
