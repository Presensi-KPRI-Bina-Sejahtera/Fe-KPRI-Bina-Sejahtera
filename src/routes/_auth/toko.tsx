import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/toko')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/toko"!</div>
}
