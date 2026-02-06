"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "@tanstack/react-router"
import { AlertCircle, Loader2 } from "lucide-react"
import { login } from "@/services/authService"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await login(email, password)

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      router.navigate({ to: "/dashboard" }) 

    } catch (err: any) {
      console.error("Login failed", err)
      const msg = err.response?.data?.message || "Login gagal. Cek email/password."
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="relative h-40 w-full mb-4">
            <img 
              src="/office.png" 
              alt="Office Background"
              className="w-full h-full object-cover blur-[1px] rounded-md"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                 <img 
                   src="/logo.png" 
                   alt="Logo Koperasi" 
                   className="size-24 object-contain drop-shadow-lg"
                 />
            </div>
          </div>
          <CardTitle className="text-2xl">Presensi KPRI Bina Sejahtera</CardTitle>
          <CardDescription className="text-sm">
            Silakan masukkan kredensial Anda untuk mengakses dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Field className="gap-0">
                <FieldLabel htmlFor="email" className="text-muted-foreground font-bold">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan Email"
                  required
                  className="p-5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
              <Field className="gap-0">
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-muted-foreground font-bold">Password</FieldLabel>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Masukkan Password" 
                  required 
                  className="p-5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
              
              <FieldSeparator>Atau lanjutkan dengan</FieldSeparator>
              
              <Field>
                <Button variant="outline" type="button" className="font-bold p-5" disabled={isLoading}>
                  <img
                    src="/google.svg"
                    alt="Google Logo"
                    className="h-4 w-4 mr-2"
                  />
                  Masuk Dengan Google
                </Button>
                
                <Button type="submit" className="font-bold bg-primary p-5" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}