"use client";

import { useTranslations } from "next-intl";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/features/shadcn/components/ui/tooltip";
import { CreateStoreButton } from "@/features/stores/components/CreateStoreButton";
import type { CreateStoreButtonGateProps } from "@/features/stores/types/gate";
import { hasReachedStoreLimit } from "@/features/subscriptions/config";

/**
 * CreateStoreButtonGate Component
 *
 * Wraps CreateStoreButton with access control logic based on account limits.
 * Shows a disabled button with upgrade tooltip when the user has reached
 * their store creation limit.
 *
 * Uses centralized ACCOUNT_LIMITS config for limit checks:
 * - FREE: 2 stores
 * - PRO: 5 stores
 * - ENTERPRISE: unlimited
 *
 * @example
 * ```tsx
 * <CreateStoreButtonGate
 *   currentStoreCount={2}
 *   accountType="FREE"
 * />
 * ```
 */
export function CreateStoreButtonGate({
  currentStoreCount,
  accountType,
  className,
}: CreateStoreButtonGateProps) {
  const t = useTranslations("store.create");

  const isLimitReached = hasReachedStoreLimit(accountType, currentStoreCount);

  // Get upgrade tooltip message based on account type
  const getUpgradeTooltip = () => {
    switch (accountType) {
      case "FREE":
        return t("upgradeTooltip.free");
      case "PRO":
        return t("upgradeTooltip.pro");
      default:
        return "";
    }
  };

  // If limit reached, show disabled button with tooltip
  if (isLimitReached) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0} className="cursor-not-allowed">
            <CreateStoreButton disabled className={className} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getUpgradeTooltip()}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // If within limit, render button normally
  return <CreateStoreButton className={className} />;
}
