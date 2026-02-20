import {
  Archive,
  ArrowLeft,
  Boxes,
  ClipboardList,
  Download,
  History,
  LayoutDashboard,
  LayoutList,
  MapPin,
  Package,
  PackagePlus,
  ShoppingCart,
  Tags,
  Truck,
  Users,
  PackageSearch,
  UserPlus,
  Building2,
  ShoppingBag,
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

export function getSubNavButtons(
  storeBase: string,
  segment: string,
  subsegment: string,
): NavBtn[] {
  switch (segment) {
    case 'products':
      return [
        {
          icon: <LayoutList className="size-4.5" />,
          label: 'Todos',
          href: `${storeBase}/products`,
          active: subsegment === '',
        },
        {
          icon: <Tags className="size-4.5" />,
          label: 'Categorías',
          href: `${storeBase}/products/categories`,
          active: subsegment === 'categories',
        },
        {
          icon: <Archive className="size-4.5" />,
          label: 'Inventario',
          href: `${storeBase}/products/inventory`,
          active: subsegment === 'inventory',
        },
      ]
    case 'operations':
      return [
        {
          icon: <MapPin className="size-4.5" />,
          label: 'Sucursales',
          href: `${storeBase}/operations/branches`,
          active: subsegment === 'branches',
        },
        {
          icon: <Users className="size-4.5" />,
          label: 'Empleados',
          href: `${storeBase}/operations/employees`,
          active: subsegment === 'employees',
        },
        {
          icon: <Truck className="size-4.5" />,
          label: 'Proveedores',
          href: `${storeBase}/operations/suppliers`,
          active: subsegment === 'suppliers',
        },
        {
          icon: <ClipboardList className="size-4.5" />,
          label: 'Órds. proveedor',
          href: `${storeBase}/operations/purchase-orders`,
          active: subsegment === 'purchase-orders',
        },
      ]
    default:
      return []
  }
}

export function getQuickActionButtons(
  storeBase: string,
  segment: string,
  callbacks?: {
    onCreateProduct?: () => void
  },
): NavBtn[] {
  const createProductBtn: NavBtn = {
    icon: <PackagePlus className="size-4.5" />,
    label: 'Crear Producto',
    onClick: callbacks?.onCreateProduct,
  }

  const newSaleBtn: NavBtn = {
    icon: <ShoppingCart className="size-4.5" />,
    label: 'Nueva Venta',
    href: `${storeBase}/orders/new`,
  }

  switch (segment) {
    case '':
      return [createProductBtn, newSaleBtn]
    case 'products':
      return [
        createProductBtn,
        {
          icon: <Tags className="size-4.5" />,
          label: 'Crear Categoría',
          href: `${storeBase}/products/categories/new`,
        },
        {
          icon: <PackageSearch className="size-4.5" />,
          label: 'Actualizar Stock',
          href: `${storeBase}/products/inventory`,
        },
      ]
    case 'orders':
      return [newSaleBtn]
    case 'operations':
      return [
        {
          icon: <Building2 className="size-4.5" />,
          label: 'Agregar Sucursal',
          href: `${storeBase}/operations/branches/new`,
        },
        {
          icon: <UserPlus className="size-4.5" />,
          label: 'Agregar Empleado',
          href: `${storeBase}/operations/employees/new`,
        },
        {
          icon: <Truck className="size-4.5" />,
          label: 'Agregar Proveedor',
          href: `${storeBase}/operations/suppliers/new`,
        },
        {
          icon: <ShoppingBag className="size-4.5" />,
          label: 'Nueva orden proveedor',
          href: `${storeBase}/operations/purchase-orders/new`,
        },
      ]
    case 'history':
      return [
        {
          icon: <Download className="size-4.5" />,
          label: 'Exportar Historial',
          href: `${storeBase}/history/export`,
        },
      ]
    default:
      return []
  }
}
