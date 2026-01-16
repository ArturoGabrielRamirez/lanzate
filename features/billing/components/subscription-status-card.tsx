/**
 * SubscriptionStatusCard Component
 *
 * Compact card component displaying subscription status information
 * for integration into the membership tab.
 *
 * Features displayed:
 * - Plan type badge (FREE, PRO, ENTERPRISE)
 * - Subscription status (PENDING, AUTHORIZED, PAUSED, CANCELLED)
 * - Next billing date (formatted for Argentine locale)
 * - MercadoPago subscription ID (for reference)
 * - Upgrade buttons (when applicable)
 * - Link to billing history page
 */

import { CreditCard } from 'lucide-react';

import { SubscriptionUpgradeButton } from '@/features/billing/components/subscription-upgrade-button';
import type { SubscriptionStatusCardProps } from '@/features/billing/types/subscription-status-card';
import { formatDateForArgentina, getStatusBadgeVariant, getStatusDisplayText } from '@/features/billing/utils/subscription-status-card.utils';
import { Badge } from '@/features/shadcn/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shadcn/components/ui/card';
import { isFreePlan, isEnterprisePlan } from '@/features/subscriptions/config';
import { Link } from '@/i18n/navigation';

export function SubscriptionStatusCard({ 
  subscriptionStatus, 
  className 
}: SubscriptionStatusCardProps) {
  const { planType, status, nextBillingDate, mercadopagoId } = subscriptionStatus;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="size-5" />
          Membresía
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Plan Type Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Plan:</span>
            <Badge variant="default">{planType}</Badge>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estado:</span>
            <Badge variant={getStatusBadgeVariant(status)}>
              {getStatusDisplayText(status)}
            </Badge>
          </div>

          {/* Next Billing Date */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Próximo cobro:</span>
            <span className="text-sm font-medium">
              {formatDateForArgentina(nextBillingDate)}
            </span>
          </div>

          {/* MercadoPago ID */}
          {mercadopagoId && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">ID MercadoPago:</span>
              <span className="text-xs font-mono text-muted-foreground">
                {mercadopagoId}
              </span>
            </div>
          )}

          {/* Upgrade Buttons */}
          {!isEnterprisePlan(planType) && (
            <div className="pt-3 border-t space-y-2">
              <p className="text-sm font-medium text-foreground">Mejorar plan</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                {isFreePlan(planType) && (
                  <SubscriptionUpgradeButton
                    currentPlan={planType}
                    targetPlan="PRO"
                    variant="default"
                    size="sm"
                    fullWidth
                  />
                )}
                <SubscriptionUpgradeButton
                  currentPlan={planType}
                  targetPlan="ENTERPRISE"
                  variant={isFreePlan(planType) ? 'outline' : 'default'}
                  size="sm"
                  fullWidth
                />
              </div>
            </div>
          )}

          {/* Billing History Link */}
          <div className="pt-3 border-t">
            <Link
              href="/profile/billing"
              className="text-sm text-primary hover:underline"
            >
              Ver historial de pagos →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}