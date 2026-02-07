import { AlertTriangle, Loader2 } from 'lucide-react'
import type { TokoRecord } from '@/services/tokoService'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface TokoDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  toko: TokoRecord | null
  onConfirm: (id: number) => void
  isDeleting: boolean
}

export function TokoDeleteDialog({
  open,
  onOpenChange,
  toko,
  onConfirm,
  isDeleting,
}: TokoDeleteDialogProps) {
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault()
    if (toko) {
      onConfirm(toko.id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-rose-600 mb-2">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle className="text-xl font-bold">Hapus Toko?</DialogTitle>
          </div>
          <DialogDescription className="text-slate-600">
            Apakah Anda yakin ingin menghapus <b>{toko?.name}</b>?
            <br />
            Data yang dihapus tidak dapat dikembalikan dan presensi di lokasi
            ini tidak akan valid lagi.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 mt-4 sm:gap-0">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-slate-200 hover:bg-slate-100 hover:text-slate-900"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            className="w-full sm:w-auto bg-rose-600 text-white hover:bg-rose-700"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              'Ya, Hapus'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
