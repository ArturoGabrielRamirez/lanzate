import {
  Archive,
  ArrowLeft,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Clock,
  History,
  LayoutDashboard,
  LayoutList,
  MapPin,
  Package,
  ShoppingCart,
  Tags,
  Truck,
  Users,
  XCircle,
} from 'lucide-react'

import type { NavBtn } from '@/features/stores/types/sidebar.types'

export function getFixedNavButtons(
  storesListHref: string,
  storeBase: string,
  segment: string,
): NavBtn[] {
  return [
    {
      icon: <ArrowLeft className="size-4.5" />,
      label: 'Volver',
      href: storesListHref,
    },
    {
      icon: <LayoutDashboard className="size-4.5" />,
      label: 'Dashboard',
      href: storeBase,
      active: segment === '',
    },
    {
      icon: <Package className="size-4.5" />,
      label: 'Productos',
      href: `${storeBase}/products`,
      active: segment === 'products',
    },
    {
      icon: <ClipboardList className="size-4.5" />,
      label: 'Órdenes',
      href: `${storeBase}/orders`,
      active: segment === 'orders',
    },
    {
      icon: <Boxes className="size-4.5" />,
      label: 'Operaciones',
      href: `${storeBase}/operations`,
      active: segment === 'operations',
    },
    {
      icon: <History className="size-4.5" />,
      label: 'Historial',
      href: `${storeBase}/history`,
      active: segment === 'history',
    },
  ]
}

export function getShortcutButtons(storeBase: string, segment: string): NavBtn[] {
  switch (segment) {
    case 'products':
      return [
        {
          icon: <LayoutList className="size-4.5" />,
          label: 'Todos los productos',
          href: `${storeBase}/products`,
          active: true,
        },
        {
          icon: <Tags className="size-4.5" />,
          label: 'Categorías',
          href: `${storeBase}/products`,
        },
        {
          icon: <Archive className="size-4.5" />,
          label: 'Inventario',
          href: `${storeBase}/products`,
        },
      ]
    case 'orders':
      return [
        {
          icon: <ClipboardList className="size-4.5" />,
          label: 'Todas las órdenes',
          href: `${storeBase}/orders`,
          active: true,
        },
        {
          icon: <Clock className="size-4.5" />,
          label: 'Pendientes',
          href: `${storeBase}/orders`,
        },
        {
          icon: <CheckCircle2 className="size-4.5" />,
          label: 'Completadas',
          href: `${storeBase}/orders`,
        },
        {
          icon: <XCircle className="size-4.5" />,
          label: 'Canceladas',
          href: `${storeBase}/orders`,
        },
      ]
    case 'operations':
      return [
        {
          icon: <MapPin className="size-4.5" />,
          label: 'Sucursales',
          href: `${storeBase}/operations`,
        },
        {
          icon: <Users className="size-4.5" />,
          label: 'Empleados',
          href: `${storeBase}/operations`,
        },
        {
          icon: <Truck className="size-4.5" />,
          label: 'Proveedores',
          href: `${storeBase}/operations`,
        },
        {
          icon: <ClipboardList className="size-4.5" />,
          label: 'Órdenes a proveedor',
          href: `${storeBase}/operations`,
        },
      ]
    case 'history':
      return [
        {
          icon: <History className="size-4.5" />,
          label: 'Todo el historial',
          href: `${storeBase}/history`,
          active: true,
        },
        {
          icon: <Package className="size-4.5" />,
          label: 'Historial productos',
          href: `${storeBase}/history`,
        },
        {
          icon: <ShoppingCart className="size-4.5" />,
          label: 'Historial ventas',
          href: `${storeBase}/history`,
        },
        {
          icon: <Users className="size-4.5" />,
          label: 'Historial personal',
          href: `${storeBase}/history`,
        },
      ]
    default:
      return []
  }
}
