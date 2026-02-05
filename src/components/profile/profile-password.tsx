import { useState } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfilePassword() {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Lock className="w-4 h-4" />
          Atur Kata Sandi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-2">
          <Label htmlFor="new-password">Kata Sandi Baru</Label>
          <div className="relative">
            <Input 
              id="new-password" 
              type={showNewPassword ? "text" : "password"} 
              placeholder="P4ssw0rd!" 
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showNewPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</Label>
          <div className="relative">
            <Input 
              id="confirm-password" 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="P4ssw0rd!" 
              className="pr-10" 
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showConfirmPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-2"
        >
          <Lock className="w-4 h-4" />
          Perbarui Kata Sandi
        </Button>
      </CardContent>
    </Card>
  )
}