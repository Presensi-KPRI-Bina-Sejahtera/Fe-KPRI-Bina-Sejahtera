import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UsersHeader() {
  return (
    <div className="flex items-center justify-between pt-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Manajemen User</h1>
        <p className="text-lg text-muted-foreground">
          Kelola hak akses pengguna aplikasi
        </p>
      </div>
      <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
        <Plus className="h-4 w-4" />
        Tambah User
      </Button>
    </div>
  )
}