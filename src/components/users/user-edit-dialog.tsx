import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { UserRecord} from "@/services/userService";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getTokoDropdown, updateUser } from "@/services/userService"

interface UserEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserRecord | null
}

export function UserEditDialog({ open, onOpenChange, user }: UserEditDialogProps) {
  const queryClient = useQueryClient()
  
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [tokoId, setTokoId] = useState("")
  const [role, setRole] = useState<"admin" | "employee">("employee")

  const { data: tokoList } = useQuery({
    queryKey: ['toko-dropdown'],
    queryFn: getTokoDropdown
  })

  useEffect(() => {
    if (user) {
      setName(user.name)
      setUsername(user.username)
      setEmail(user.email)
      setRole(user.role as "admin" | "employee")
      setTokoId(user.presence_location_id ? String(user.presence_location_id) : "")
    }
  }, [user])

  const mutation = useMutation({
    mutationFn: (data: any) => updateUser(user!.id, data),
    onSuccess: () => {
      toast.success("User berhasil diperbarui")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      onOpenChange(false)
    },
    onError: (error: any) => {
      console.error(error)
      toast.error("Gagal memperbarui user")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    mutation.mutate({
      name,
      username,
      email,
      role,
      presence_location_id: tokoId ? Number(tokoId) : null
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit User</DialogTitle>
            <DialogDescription>
              Silakan ubah data user
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-slate-500">Nama Lengkap</Label>
              <Input 
                id="edit-name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-username" className="text-slate-500">Username</Label>
              <Input 
                id="edit-username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email" className="text-slate-500">Email</Label>
              <Input 
                id="edit-email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-500">Toko</Label>
              <Select value={tokoId} onValueChange={setTokoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Toko" />
                </SelectTrigger>
                <SelectContent>
                  {tokoList?.map((toko: any) => (
                    <SelectItem key={toko.id} value={String(toko.id)}>
                      {toko.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-500">Role</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRole("employee")}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${
                    role === "employee" 
                      ? "bg-amber-100 text-amber-600 border-2 border-amber-200" 
                      : "bg-slate-100 text-slate-400 border border-transparent hover:bg-slate-200"
                  }`}
                >
                  Pegawai
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${
                    role === "admin" 
                      ? "bg-rose-100 text-rose-600 border-2 border-rose-200" 
                      : "bg-slate-100 text-slate-400 border border-transparent hover:bg-slate-200"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="destructive" 
              className="md:w-[50%] w-full h-12"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12"
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}