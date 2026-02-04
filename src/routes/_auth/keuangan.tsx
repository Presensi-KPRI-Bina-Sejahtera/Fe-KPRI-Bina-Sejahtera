import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/keuangan')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/keuangan"!</div>
}
