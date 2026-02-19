"use client"

import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  BookOpen,
  CircleHelp,
  CreditCard,
  LayoutGrid,
  MessageCircle,
  Palette,
  Settings2,
  Star,
  Store,
  Trash2,
} from 'lucide-react'
import { usePathname } from 'next/navigation'

import { GooeySidebar } from '@/features/global/components/gooey-sidebar/gooey-sidebar'
import { CreateProductFormDialog } from '@/features/products/components/create-form/create-product-form-dialog'
import { CreateProductProvider } from '@/features/products/components/create-form/create-product-provider'
import { useCreateProductContext } from '@/features/products/hooks'
import { SidebarSection } from '@/features/stores/components/sidebar-section'
import {
  getFixedNavButtons,
  getShortcutButtons,
} from '@/features/stores/constants/store-admin-sidebar.constants'

interface StoreAdminSidebarProps {
  subdomain: string
  storeId?: string
}

export function StoreAdminSidebar({ subdomain, storeId }: StoreAdminSidebarProps) {
  return (
    <CreateProductProvider>
      <StoreAdminSidebarContent subdomain={subdomain} storeId={storeId} />
      {storeId && <CreateProductFormDialog storeId={storeId} />}
    </CreateProductProvider>
  )
}

function StoreAdminSidebarContent({ subdomain }: StoreAdminSidebarProps) {
  const pathname = usePathname()
  const { openDialog } = useCreateProductContext()

  const storeBase = pathname.split(`/stores/${subdomain}`)[0] + `/stores/${subdomain}`
  const storesListHref = pathname.split(`/stores/${subdomain}`)[0] + '/stores'
  const afterBase = pathname.split(`/stores/${subdomain}`)[1] ?? ''
  const segment = afterBase.replace(/^\//, '').split('/')[0] ?? ''

  const shortcuts = getShortcutButtons(storeBase, segment, { onCreateProduct: openDialog })

  const navContent = (
    <div className="p-3 flex flex-col gap-4">
      <SidebarSection
        title="Navegación"
        buttons={getFixedNavButtons(storesListHref, storeBase, segment)}
      />
      <AnimatePresence mode='wait'>
        {shortcuts.length > 0 && (
          <motion.div
            key={`shortcuts-${segment}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <SidebarSection title="Atajos" buttons={shortcuts} cols={2} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const configContent = (
    <div className="p-3 flex flex-col gap-4">
      <SidebarSection
        title="Configuración"
        buttons={[
          { icon: <Store className="size-4.5" />, label: 'General', href: '' },
          { icon: <Palette className="size-4.5" />, label: 'Apariencia', href: '' },
          { icon: <CreditCard className="size-4.5" />, label: 'Pagos', href: '' },
          { icon: <Bell className="size-4.5" />, label: 'Alertas', href: '' },
          { icon: <Trash2 className="size-4.5" />, label: 'Peligro', href: '' },
        ]}
      />
    </div>
  )

  const helpContent = (
    <div className="p-3 flex flex-col gap-4">
      <SidebarSection
        title="Ayuda & Recursos"
        buttons={[
          { icon: <BookOpen className="size-4.5" />, label: 'Docs', href: '' },
          { icon: <MessageCircle className="size-4.5" />, label: 'Soporte', href: '' },
          { icon: <Star className="size-4.5" />, label: 'Feedback', href: '' },
        ]}
      />
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
