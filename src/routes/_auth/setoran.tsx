import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/setoran')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/setoran"!</div>
}
