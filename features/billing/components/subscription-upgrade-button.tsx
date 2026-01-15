'use client';

/**
 * SubscriptionUpgradeButton Component
 *
 * Reusable button component for upgrading subscription plans.
 * Calls the createSubscriptionCheckoutAction and redirects user to MercadoPago.
 *
 * Features:
 * - Loading state while creating checkout
 * - Disabled when current plan >= target plan
 * - Toast notifications for feedback
 * - Redirects to MercadoPago checkout on success
 *
 * @example
 * ```tsx
 * <SubscriptionUpgradeButton
 *   currentPlan="FREE"
 *   targetPlan="PRO"
 *   variant="default"
 * />
 * ```
 */

import { Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { createSubscriptionCheckoutAction } from '@/features/billing/actions/create-subscription-checkout.action';
import type { SubscriptionUpgradeButtonProps } from '@/features/billing/types/subscription-upgrade-button';
import { Button } from '@/features/shadcn/components/ui/button';
import { cn } from '@/features/shadcn/utils/cn';
import { getPlanDisplayName, type PaidPlan } from '@/features/subscriptions/config';

import type { AccountType } from '@prisma/client';

/**
 * Plan hierarchy for comparison
 */
const PLAN_HIERARCHY: Record<AccountType, number> = {
  FREE: 0,
  PRO: 1,
  ENTERPRISE: 2,
};

/**
 * Get button label for target plan using centralized config
 */
function getUpgradeLabel(targetPlan: PaidPlan): string {
  return `Upgrade a ${getPlanDisplayName(targetPlan)}`;
}

export function SubscriptionUpgradeButton({
  currentPlan,
  targetPlan,
  variant = 'default',
  size = 'default',
  className,
  fullWidth = false,
}: SubscriptionUpgradeButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Disable if current plan is equal or higher than target
  const isDisabled = PLAN_HIERARCHY[currentPlan] >= PLAN_HIERARCHY[targetPlan];

  const handleUpgrade = async () => {
    if (isDisabled || isLoading) return;

    setIsLoading(true);
    toast.loading('Preparando checkout...', { id: 'checkout' });

    try {
      const result = await createSubscriptionCheckoutAction(targetPlan);

      if (result.hasError || !result.payload) {
        toast.error(result.message || 'Error al crear el checkout', { id: 'checkout' });
        return;
      }

      toast.success('Redirigiendo a MercadoPago...', { id: 'checkout' });

      // Redirect to MercadoPago checkout
      router.push(result.payload);
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Error al conectar con MercadoPago', { id: 'checkout' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled || isLoading}
      onClick={handleUpgrade}
      className={cn(fullWidth && 'w-full', className)}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cargando...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          {getUpgradeLabel(targetPlan)}
        </>
      )}
    </Button>
  );
}
