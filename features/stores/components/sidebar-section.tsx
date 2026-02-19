"use client"

import { useRouter } from 'next/navigation'

import { Button } from '@/features/global/components/button/button'
import { Text } from '@/features/global/components/typography/text/text'
import { Title } from '@/features/global/components/typography/title/title'
import type { NavBtn } from '@/features/stores/types/sidebar.types'

interface SidebarSectionProps {
  title: string
  buttons: NavBtn[]
  cols?: 2 | 3 | 4
}

const colsClass: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

export function SidebarSection({ title, buttons, cols = 4 }: SidebarSectionProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-2">
      <Title size="sm" className="border-b border-border pb-2">{title}</Title>
      <div className={`grid ${colsClass[cols]} gap-2`}>
        {buttons.map((btn, i) => (
          <Button
            key={i}
            variant={btn.active ? 'outline' : 'secondary'}
            className={
              'aspect-square w-full flex-col gap-1 p-1 h-auto ' +
              (btn.active ? 'bg-primary/50 hover:bg-primary' : '')
            }
            onClick={btn.href ? () => router.push(btn.href) : undefined}
            tooltip={btn.label}
          >
            {btn.icon}
            <Text size="2xs" className="truncate max-w-full">{btn.label}</Text>
          </Button>
        ))}
      </div>
    </div>
  )
}
