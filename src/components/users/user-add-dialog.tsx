import { useState } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/services/api"

const getTokoDropdown = async () => {
  const response = await api.get('/admin/presence-location/dropdown')
  return response.data.data
}

const createUser = async (data: any) => {
  await api.post('/admin/user', data)
}

export function UserAddDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [tokoId, setTokoId] = useState("")
  const [role, setRole] = useState<"admin" | "employee">("employee")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const { data: tokoList } = useQuery({
    queryKey: ['toko-dropdown'],
    queryFn: getTokoDropdown
  })

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User berhasil ditambahkan")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setOpen(false)
      setName("")
      setUsername("")
      setEmail("")
      setTokoId("")
      setRole("employee")
      setFieldErrors({})
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors)
      }
      toast.error(error.response?.data?.message || "Gagal menambahkan user")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      name,
      username,
      email,
      role,
      presence_location_id: tokoId ? Number(tokoId) : null
    })
  }

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 h-12 font-bold">
          <Plus className="h-4 w-4" />
          Tambah User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Tambah User Baru</DialogTitle>
            <DialogDescription>
              Silakan masukkan data user baru
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className={fieldErrors.name ? "text-red-500" : "text-slate-500"}>
                Nama Lengkap
              </Label>
              <Input 
                id="name" 
                placeholder="Masukkan nama" 
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
              <Label htmlFor="username" className={fieldErrors.username ? "text-red-500" : "text-slate-500"}>
                Username
              </Label>
              <Input 
                id="username" 
                placeholder="Masukkan Username" 
                value={username}
                onChange={(e) => handleInputChange(setUsername, "username", e.target.value)}
                className={fieldErrors.username ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {fieldErrors.username && (
                <p className="text-sm text-red-500">{fieldErrors.username[0]}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className={fieldErrors.email ? "text-red-500" : "text-slate-500"}>
                Email
              </Label>
              <Input 
                id="email" 
                type="email"
                placeholder="Masukkan Email" 
                value={email}
                onChange={(e) => handleInputChange(setEmail, "email", e.target.value)}
                className={fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-500">{fieldErrors.email[0]}</p>
              )}
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
              onClick={() => setOpen(false)}
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