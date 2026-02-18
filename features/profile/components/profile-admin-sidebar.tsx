"use client"

import {
  Activity,
  ArrowLeft,
  Bell,
  BookOpen,
  CircleHelp,
  Clock,
  CreditCard,
  Globe,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  Mail,
  MessageCircle,
  Package,
  Palette,
  Settings2,
  Shield,
  Smartphone,
  Star,
  User,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/features/global/components/button/button'
import { GooeySidebar } from '@/features/global/components/gooey-sidebar/gooey-sidebar'
import { Text } from '@/features/global/components/typography/text/text'

interface NavBtn {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
}

export function ProfileAdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const profileBase = pathname.split('/profile')[0] + '/profile'
  const dashboardHref = pathname.split('/profile')[0] + '/dashboard'
  const afterBase = pathname.split('/profile')[1] ?? ''
  const segment = afterBase.replace(/^\//, '').split('/')[0] ?? ''

  const getNavButtons = (): NavBtn[] => {
    switch (segment) {
      case '':
        return [
          { icon: <ArrowLeft className="size-4.5" />, label: 'Dashboard', href: dashboardHref },
          { icon: <User className="size-4.5" />, label: 'Mi perfil', href: profileBase, active: true },
          { icon: <CreditCard className="size-4.5" />, label: 'Facturación', href: `${profileBase}/billing` },
          { icon: <Shield className="size-4.5" />, label: 'Seguridad', href: profileBase },
          { icon: <Bell className="size-4.5" />, label: 'Notificaciones', href: profileBase },
        ]
      case 'billing':
        return [
          { icon: <ArrowLeft className="size-4.5" />, label: 'Volver', href: profileBase },
          { icon: <CreditCard className="size-4.5" />, label: 'Historial de pagos', href: `${profileBase}/billing`, active: true },
          { icon: <Package className="size-4.5" />, label: 'Mi plan', href: `${profileBase}/billing` },
        ]
      case 'security':
        return [
          { icon: <ArrowLeft className="size-4.5" />, label: 'Volver', href: profileBase },
          { icon: <KeyRound className="size-4.5" />, label: 'Contraseña', href: `${profileBase}/security`, active: true },
          { icon: <Smartphone className="size-4.5" />, label: '2FA', href: `${profileBase}/security` },
          { icon: <Activity className="size-4.5" />, label: 'Sesiones', href: `${profileBase}/security` },
        ]
      case 'notifications':
        return [
          { icon: <ArrowLeft className="size-4.5" />, label: 'Volver', href: profileBase },
          { icon: <Bell className="size-4.5" />, label: 'General', href: `${profileBase}/notifications`, active: true },
          { icon: <Mail className="size-4.5" />, label: 'Email', href: `${profileBase}/notifications` },
        ]
      default:
        return [
          { icon: <ArrowLeft className="size-4.5" />, label: 'Volver', href: profileBase },
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

  const preferencesContent = (
    <div className="grid grid-cols-4 gap-2 p-3">
      {[
        { icon: <Palette className="size-4.5" />, label: 'Apariencia' },
        { icon: <Globe className="size-4.5" />, label: 'Idioma' },
        { icon: <Clock className="size-4.5" />, label: 'Zona horaria' },
        { icon: <LayoutDashboard className="size-4.5" />, label: 'Tema' },
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
    { icon: <Settings2 className="h-5 w-5" />, content: preferencesContent },
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
