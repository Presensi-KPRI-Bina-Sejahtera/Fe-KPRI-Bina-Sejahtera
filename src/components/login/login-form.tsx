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
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
        <div className="relative h-40 w-full">
            <img 
              src="/office.png" 
              alt="Office Background"
              className="w-full h-full object-cover blur-[1px] rounded-md"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                 <img 
                   src="/logo.png" 
                   alt="Logo Koperasi" 
                   className="size-24 object-contain"
                 />
            </div>
        </div>
          <CardTitle className="text-2xl">Presensi KPRI Bina Sejahtera</CardTitle>
          <CardDescription className="text-sm">
            Silakan masukkan kredensial Anda untuk mengakses dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field className="gap-0">
                <FieldLabel htmlFor="email" className="text-muted-foreground font-bold">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan Email"
                  required
                  className="p-5"
                />
              </Field>
              <Field className="gap-0">
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-muted-foreground font-bold">Password</FieldLabel>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input id="password" type="password" placeholder="Masukkan Password" required className="p-5" />
              </Field>
              <FieldSeparator>Atau lanjutkan dengan</FieldSeparator>
              <Field>
                <Button variant="outline" type="button" className="font-bold p-5">
                  <img
                    src="/google.svg"
                    alt="Google Logo"
                    className="h-4 w-4"
                  />
                  Masuk Dengan Google
                </Button>
                <Button type="submit" className="font-bold bg-primary p-5">Masuk</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
