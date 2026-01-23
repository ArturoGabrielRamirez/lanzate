/**
 * Admin Card Component
 *
 * Card for the admin panel section showing a feature with icon, title, and subtitle.
 */

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/features/shadcn/utils/cn';

export interface AdminCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  subtitle: string;
  href?: string;
  disabled?: boolean;
}

export function AdminCard({
  icon: Icon,
  iconClassName,
  title,
  subtitle,
  href,
  disabled = false,
}: AdminCardProps) {
  const content = (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl bg-card p-4 transition-all',
        !disabled && href && 'hover:shadow-md hover:scale-[1.02] cursor-pointer',
        disabled && 'opacity-60 cursor-not-allowed'
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl',
          iconClassName
        )}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );

  if (href && !disabled) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
