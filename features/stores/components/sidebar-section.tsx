"use client"

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

import { Button } from '@/features/global/components/button/button'
import { Text } from '@/features/global/components/typography/text/text'
import { Title } from '@/features/global/components/typography/title/title'
import type { NavBtn } from '@/features/stores/types/sidebar.types'

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 4 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' as const } },
  exit: { opacity: 0, scale: 0.85, y: 4, transition: { duration: 0.15, ease: 'easeIn' as const } },
}

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
      <motion.div
        className={`grid ${colsClass[cols]} gap-2`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {buttons.map((btn, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Button
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
