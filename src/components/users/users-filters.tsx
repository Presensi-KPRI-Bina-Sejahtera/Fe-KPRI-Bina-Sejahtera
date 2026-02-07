import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Filter, Search, X } from "lucide-react"
import type { UserParams } from "@/services/userService"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function UsersFilters({ currentFilters }: { currentFilters: UserParams }) {
  const navigate = useNavigate()

  const [filters, setFilters] = useState(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters])

  const applyFilter = (key: keyof UserParams, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    navigate({
      to: '/users',
      search: { 
        ...newFilters, 
        page: 1, 
        per_page: newFilters.per_page ?? 10
      },
      replace: true,
    })
  }

  const isAdminChecked = filters.role !== 'employee'
  const isEmployeeChecked = filters.role !== 'admin'

  const handleRoleToggle = (toggled: 'admin' | 'employee') => {
    if (toggled === 'admin') {
      if (isAdminChecked) applyFilter('role', 'employee')
      else applyFilter('role', undefined)
    } else {
      if (isEmployeeChecked) applyFilter('role', 'admin')
      else applyFilter('role', undefined)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilter('search', filters.search)
    }
  }

  return (
    <Card className="p-0 border-3 border-slate-200 shadow-lg">
      <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="font-bold">Filter Role:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox 
              id="role-admin" 
              checked={isAdminChecked}
              onCheckedChange={() => handleRoleToggle('admin')}
            />
            <Label htmlFor="role-admin" className="font-bold cursor-pointer">Admin</Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox 
              id="role-pegawai" 
              checked={isEmployeeChecked}
              onCheckedChange={() => handleRoleToggle('employee')}
            />
            <Label htmlFor="role-pegawai" className="font-bold cursor-pointer">Pegawai</Label>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama..." 
            className="pl-9 pr-8" 
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onBlur={() => applyFilter('search', filters.search)}
            onKeyDown={handleSearchKeyDown}
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => applyFilter('search', '')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

      </CardContent>
    </Card>
  )
}