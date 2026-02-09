import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { UserRecord } from "@/services/userService"
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
import { useUserProfile } from "@/hooks/use-user-profile"

interface UserEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserRecord | null
}

export function UserEditDialog({ open, onOpenChange, user }: UserEditDialogProps) {
  const queryClient = useQueryClient()
  const { data: currentUser } = useUserProfile()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [tokoId, setTokoId] = useState("")
  const [role, setRole] = useState<"admin" | "employee">("employee")
  const [fieldErrors, setFieldErrors] = useState<Record<string, Array<string>>>({})

  const { data: tokoList } = useQuery({
    queryKey: ['toko-dropdown'],
    queryFn: getTokoDropdown
  })

  useEffect(() => {
    if (user) {
      setName(user.name)
      setUsername(user.username)
      setEmail(user.email)
      const safeRole = (user.role || "employee").toLowerCase() as "admin" | "employee"
      setRole(safeRole)
      setTokoId(user.presence_location_id ? String(user.presence_location_id) : "")
      setFieldErrors({})
    }
  }, [user])

  const mutation = useMutation({
    mutationFn: (data: any) => updateUser(user!.id, data),
    onSuccess: (_, variables) => {
      toast.success("User berhasil diperbarui")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      if (currentUser && currentUser.id === user?.id) {
        queryClient.invalidateQueries({ queryKey: ["profile"] })
        const updatedUser = { ...currentUser, ...variables }
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }

      onOpenChange(false)
      setFieldErrors({})
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors)
      }
      toast.error(error.response?.data?.message || "Gagal memperbarui user")
    }
  })

  const handleInputChange = (
    setter: (value: string) => void, 
    field: string, 
    value: string
  ) => {
    setter(value)
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    mutation.mutate({
      name,
      username,
      email,
      role,
      presence_location_id: (role === 'employee' && tokoId) ? Number(tokoId) : null
    })
  }

  const isSelf = currentUser?.id === user?.id
  
  const isFormValid = 
    name.trim() !== "" && 
    username.trim() !== "" && 
    email.trim() !== "" && 
    (role === "admin" || (role === "employee" && tokoId !== ""))

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
              <Label htmlFor="edit-name" className={fieldErrors.name ? "text-red-500" : "text-slate-500"}>
                Nama Lengkap*
              </Label>
              <Input 
                id="edit-name" 
                value={name}
                onChange={(e) => handleInputChange(setName, "name", e.target.value)}
                className={fieldErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {fieldErrors.name && (
                <p className="text-sm text-red-500">{fieldErrors.name[0]}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-username" className={fieldErrors.username ? "text-red-500" : "text-slate-500"}>
                Username*
              </Label>
              <Input 
                id="edit-username" 
                value={username}
                onChange={(e) => handleInputChange(setUsername, "username", e.target.value)}
                className={fieldErrors.username ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {fieldErrors.username && (
                <p className="text-sm text-red-500">{fieldErrors.username[0]}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email" className={fieldErrors.email ? "text-red-500" : "text-slate-500"}>
                Email*
              </Label>
              <Input 
                id="edit-email" 
                type="email"
                value={email}
                onChange={(e) => handleInputChange(setEmail, "email", e.target.value)}
                className={fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-500">{fieldErrors.email[0]}</p>
              )}
            </div>

            {role === "employee" && (
              <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <Label className="text-slate-500">Toko*</Label>
                <Select value={tokoId} onValueChange={setTokoId}>
                  <SelectTrigger className="cursor-pointer">
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
            )}

            <div className="grid gap-2">
              <Label className="text-slate-500">
                Role* {isSelf && <span className="text-xs text-amber-600 font-normal ml-2">(Tidak dapat mengubah role sendiri)</span>}
              </Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => !isSelf && setRole("employee")}
                  disabled={isSelf}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-colors cursor-pointer ${
                    role === "employee" 
                      ? "bg-amber-100 text-amber-600 border-2 border-amber-200" 
                      : "bg-slate-100 text-slate-400 border border-transparent hover:bg-slate-200"
                  } ${isSelf ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Pegawai
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isSelf) {
                      setRole("admin")
                      setTokoId("")
                    }
                  }}
                  disabled={isSelf}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-colors cursor-pointer ${
                    role === "admin" 
                      ? "bg-rose-100 text-rose-600 border-2 border-rose-200" 
                      : "bg-slate-100 text-slate-400 border border-transparent hover:bg-slate-200"
                  } ${isSelf ? "opacity-50 cursor-not-allowed" : ""}`}
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
              className="md:w-[50%] w-full h-12 cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12 cursor-pointer"
              disabled={mutation.isPending || !isFormValid}
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