"use client"

import {
  Archive,
  ArrowLeft,
  Bell,
  BookOpen,
  Boxes,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  Clock,
  CreditCard,
  History,
  LayoutDashboard,
  LayoutGrid,
  LayoutList,
  MapPin,
  MessageCircle,
  Package,
  Palette,
  Settings2,
  ShoppingCart,
  Star,
  Store,
  Tags,
  Trash2,
  Truck,
  Users,
  XCircle,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/features/global/components/button/button'
import { GooeySidebar } from '@/features/global/components/gooey-sidebar/gooey-sidebar'
import { Text } from '@/features/global/components/typography/text/text'

interface StoreAdminSidebarProps {
  subdomain: string
}

interface NavBtn {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
}

export function StoreAdminSidebar({ subdomain }: StoreAdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const storeBase = pathname.split(`/stores/${subdomain}`)[0] + `/stores/${subdomain}`
  const storesListHref = pathname.split(`/stores/${subdomain}`)[0] + '/stores'
  const afterBase = pathname.split(`/stores/${subdomain}`)[1] ?? ''
  const segment = afterBase.replace(/^\//, '').split('/')[0] ?? ''

  const getNavButtons = (): NavBtn[] => {
    switch (segment) {
      case '':
        return [
          { icon: <ArrowLeft className="size-4.5" />, label: 'Mis tiendas', href: storesListHref },
          { icon: <LayoutDashboard className="size-4.5" />, label: 'Dashboard', href: storeBase, active: true },
          { icon: <Package className="size-4.5" />, label: 'Productos', href: `${storeBase}/products` },
          { icon: <ShoppingCart className="size-4.5" />, label: 'Órdenes', href: `${storeBase}/orders` },
          { icon: <Boxes className="size-4.5" />, label: 'Operaciones', href: `${storeBase}/operations` },
          { icon: <History className="size-4.5" />, label: 'Historial', href: `${storeBase}/history` },
        ]
      case 'products':
        return [
          { icon: <ArrowLeft className="size-4.5" />, label: 'Volver', href: storeBase },
          { icon: <LayoutList className="size-4.5" />, label: 'Todos los productos', href: `${storeBase}/products`, active: true },
          { icon: <Tags className="size-4.5" />, label: 'Categorías', href: `${storeBase}/products` },
          { icon: <Archive className="size-4.5" />, label: 'Inventario', href: `${storeBase}/products` },
        ]
      case 'orders':
        return [
          { icon: <ArrowLeft className="size-4.5" />, label: 'Volver', href: storeBase },
          { icon: <ClipboardList className="size-4.5" />, label: 'Todas las órdenes', href: `${storeBase}/orders`, active: true },
          { icon: <Clock className="size-4.5" />, label: 'Pendientes', href: `${storeBase}/orders` },
          { icon: <CheckCircle2 className="size-4.5" />, label: 'Completadas', href: `${storeBase}/orders` },
          { icon: <XCircle className="size-4.5" />, label: 'Canceladas', href: `${storeBase}/orders` },
        ]
      case 'operations':
        return [
          { icon: <ArrowLeft className="size-4.5" />, label: 'Volver', href: storeBase },
          { icon: <MapPin className="size-4.5" />, label: 'Sucursales', href: `${storeBase}/operations` },
          { icon: <Users className="size-4.5" />, label: 'Empleados', href: `${storeBase}/operations` },
          { icon: <Truck className="size-4.5" />, label: 'Proveedores', href: `${storeBase}/operations` },
          { icon: <ClipboardList className="size-4.5" />, label: 'Órdenes a proveedor', href: `${storeBase}/operations` },
        ]
      case 'history':
        return [
          { icon: <ArrowLeft className="size-4.5" />, label: 'Volver', href: storeBase },
          { icon: <History className="size-4.5" />, label: 'Todo el historial', href: `${storeBase}/history`, active: true },
          { icon: <Package className="size-4.5" />, label: 'Historial productos', href: `${storeBase}/history` },
          { icon: <ShoppingCart className="size-4.5" />, label: 'Historial ventas', href: `${storeBase}/history` },
          { icon: <Users className="size-4.5" />, label: 'Historial personal', href: `${storeBase}/history` },
        ]
      default:
        return [
          { icon: <ArrowLeft className="size-4.5" />, label: 'Volver', href: storeBase },
        ]
    }
  }

  const navContent = (
    <div className="grid grid-cols-4 gap-2 p-3">
      {getNavButtons().map((btn, i) => (
        <Button
          key={i}
          variant={btn.active ? 'default' : 'outline'}
          className={"aspect-square w-full flex-col gap-1 p-1 h-auto " + (btn.active ? 'bg-primary/50 hover:bg-primary' : '')}
          onClick={() => router.push(btn.href)}
          tooltip={btn.label}
        >
          {btn.icon}
          <Text size='xs' className='truncate max-w-full'>{btn.label}</Text>
        </Button>
      ))}
    </div>
  )

  const configContent = (
    <div className="grid grid-cols-4 gap-2 p-3">
      {[
        { icon: <Store className="size-4.5" />, label: 'General' },
        { icon: <Palette className="size-4.5" />, label: 'Apariencia' },
        { icon: <CreditCard className="size-4.5" />, label: 'Pagos' },
        { icon: <Bell className="size-4.5" />, label: 'Alertas' },
        { icon: <Trash2 className="size-4.5" />, label: 'Peligro' },
      ].map((btn, i) => (
        <Button key={i} variant="outline" className="aspect-square w-full flex-col gap-1 p-1 h-auto" tooltip={btn.label}>
          {btn.icon}
          <Text size='xs' className='truncate max-w-full'>{btn.label}</Text>
        </Button>
      ))}
    </div>
  )

  const helpContent = (
    <div className="grid grid-cols-4 gap-2 p-3">
      {[
        { icon: <BookOpen className="size-4.5" />, label: 'Docs' },
        { icon: <MessageCircle className="size-4.5" />, label: 'Soporte' },
        { icon: <Star className="size-4.5" />, label: 'Feedback' },
      ].map((btn, i) => (
        <Button key={i} variant="outline" className="aspect-square w-full flex-col gap-1 p-1 h-auto" tooltip={btn.label}>
          {btn.icon}
          <Text size='xs' className='truncate max-w-full'>{btn.label}</Text>
        </Button>
      ))}
    </div>
  )

  const tabs = [
    { icon: <LayoutGrid className="h-5 w-5" />, content: navContent },
    { icon: <Settings2 className="h-5 w-5" />, content: configContent },
    { icon: <CircleHelp className="h-5 w-5" />, content: helpContent },
  ]

  return (
    <GooeySidebar
      tabs={tabs}
      orientation="horizontal"
      size="tight"
      className="h-full"
    />
  )
}
