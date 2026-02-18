"use client"

import { LayoutDashboard, MapPin, Package } from 'lucide-react'

import { GooeySidebar } from '@/features/global/components/gooey-sidebar/gooey-sidebar'

const overviewContent = (
  <div className="space-y-3 p-3">
    <div className="h-4 w-3/4 rounded bg-muted-foreground/20" />
    <div className="h-4 w-1/2 rounded bg-muted-foreground/20" />
    <div className="h-20 rounded-lg bg-muted-foreground/10" />
    <div className="h-4 w-2/3 rounded bg-muted-foreground/20" />
    <div className="h-4 w-1/3 rounded bg-muted-foreground/20" />
  </div>
)

const productosContent = (
  <div className="space-y-2 p-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-2 rounded-lg bg-muted-foreground/10 p-2">
        <div className="h-8 w-8 shrink-0 rounded bg-muted-foreground/20" />
        <div className="flex-1 space-y-1">
          <div className="h-3 w-3/4 rounded bg-muted-foreground/20" />
          <div className="h-3 w-1/2 rounded bg-muted-foreground/15" />
        </div>
      </div>
    ))}
  </div>
)

const sucursalesContent = (
  <div className="space-y-2 p-3">
    {[1, 2].map((i) => (
      <div key={i} className="rounded-lg bg-muted-foreground/10 p-3 space-y-1">
        <div className="h-3 w-1/2 rounded bg-muted-foreground/20" />
        <div className="h-3 w-3/4 rounded bg-muted-foreground/15" />
      </div>
    ))}
  </div>
)

const tabs = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: 'Resumen',
    content: overviewContent,
  },
  {
    icon: <Package className="h-5 w-5" />,
    label: 'Productos',
    content: productosContent,
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    label: 'Sucursales',
    content: sucursalesContent,
  },
]

export function StoreAdminSidebar() {
  return (
    <div className="w-64 shrink-0 h-full">
      <GooeySidebar
        tabs={tabs}
        orientation="horizontal"
        size="tight"
        className="h-full"
      />
    </div>
  )
}
