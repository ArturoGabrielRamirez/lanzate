'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { AsyncButtonProps } from '@/features/global/types';
import { cn } from '@/lib/utils';

export function AsyncButton({
  onClickAsync,
  children,
  leftIcon,
  iconOnly = false,
  loadingText,
  variant = 'default',
  size = 'lg',
  className,
  disabled,
  ...props
}: AsyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onClickAsync();
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      if (iconOnly) return <Spinner size="sm" />;
      return (
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          {loadingText && <span>{loadingText}</span>}
        </div>
      );
    }

    if (iconOnly && leftIcon) return leftIcon;

    if (leftIcon && children) {
      return (
        <div className="flex items-center gap-2">
          {leftIcon}
          <span>{children}</span>
        </div>
      );
    }

    return children;
  };

  const isDisabled = disabled || isLoading;

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant={variant}
      size={iconOnly ? 'icon' : size}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={cn(className)}
      {...props}
    >
      {renderContent()}
    </Button>
  );
}


