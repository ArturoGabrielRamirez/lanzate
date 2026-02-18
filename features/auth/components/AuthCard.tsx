
import { Title } from "@/features/global/components/typography/title/title";
import { Typography } from "@/features/global/components/typography/typography/typography";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/features/shadcn/components/ui/card";

import type { AuthCardProps } from "../types/components";
import type { ReactNode } from "react";

/**
 * AuthCard Component
 *
 * A server component wrapper for authentication forms that provides consistent
 * styling and layout across all auth pages (login, signup, password reset, etc.).
 *
 * Features:
 * - Server component (default - no "use client")
 * - Uses shadcn Card components for consistent UI
 * - Supports heading for card title
 * - Supports description for subtitle/helper text
 * - Supports footer links (e.g., "Don't have an account? Sign up")
 * - Accepts children prop to wrap form components
 * - Consistent padding, spacing, and styling
 *
 * @example
 * ```tsx
 * import { AuthCard } from '@/features/auth/components/AuthCard';
 * import { LoginForm } from '@/features/auth/components/LoginForm';
 * import Link from 'next/link';
 *
 * export function LoginPage() {
 *   return (
 *     <AuthCard
 *       heading="Welcome Back"
 *       description="Sign in to your account to continue"
 *       footer={
 *         <div className="flex gap-2 items-center justify-center">
 *           <span className="text-sm text-gray-600">Don't have an account?</span>
 *           <Link href="/signup" className="text-sm text-blue-500 hover:underline">
 *             Sign up
 *           </Link>
 *         </div>
 *       }
 *     >
 *       <LoginForm />
 *     </AuthCard>
 *   );
 * }
 * ```
 */
export function AuthCard({
  heading,
  description,
  footer,
  children,
  className,
}: AuthCardProps) {
  return (
    <Card className={className}>
      {(heading || description) && (
        <CardHeader>
          {heading && <Title size="sm">{heading}</Title>}
          {description && <Typography variant="muted">{description}</Typography>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter className="flex flex-col gap-2">{footer}</CardFooter>}
    </Card>
  );
}
