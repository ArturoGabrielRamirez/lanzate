import { Button } from '@/features/shadcn/components/ui/button'
import { Card, CardContent } from '@/features/shadcn/components/ui/card'
import { Badge } from '@/features/shadcn/components/ui/badge'
import { Check } from 'lucide-react'
import { OptimizationOptionProps } from '../types'

export function OptimizationOption({
  icon: Icon,
  iconColor,
  title,
  description,
  badges = [],
  features,
  onClick
}: OptimizationOptionProps) {
  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-2 hover:border-primary/50">
      <CardContent className="p-4" onClick={onClick}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{title}</h3>
              {badges.map((badge, index) => {
                const BadgeIcon = badge.icon
                return (
                  <Badge key={index} variant={badge.variant || 'secondary'}>
                    {BadgeIcon && <BadgeIcon className="w-3 h-3 mr-1" />}
                    {badge.label}
                  </Badge>
                )
              })}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {description}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
              {features.map((feature, index) => (
                <>
                  <Check className="w-3 h-3" />
                  <span>{feature}</span>
                  {index < features.length - 1 && <span>•</span>}
                </>
              ))}
            </div>
          </div>
          <Button variant="outline" size="sm">
            Seleccionar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}