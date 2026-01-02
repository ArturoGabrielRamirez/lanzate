'use client';

import { LogOut } from 'lucide-react';
import { useState, useTransition } from 'react';

import { logoutAction } from '@/features/auth/actions/logout.action';
import { Button } from '@/features/shadcn/components/ui/button';

/**
 * Logout Button Component
 *
 * Client component that handles user logout.
 * Uses the logout Server Action and React's useTransition for pending state.
 *
 * Features:
 * - Calls logout Server Action
 * - Shows loading state during logout
 * - Redirects to landing page after successful logout
 * - Accessible with proper ARIA labels
 */
export function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    startTransition(async () => {
      try {
        const result = await logoutAction();
        if (result.hasError) {
          setError(result.message);
        }
        // Success - user will be redirected by the action
      } catch (err) {
        setError('Failed to logout. Please try again.');
      }
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        disabled={isPending}
        aria-label="Logout"
        title="Logout"
      >
        <LogOut className="h-5 w-5" />
      </Button>
      {error && (
        <div className="absolute right-0 top-full mt-2 rounded-md bg-destructive px-3 py-2 text-xs text-destructive-foreground">
          {error}
        </div>
      )}
    </>
  );
}
