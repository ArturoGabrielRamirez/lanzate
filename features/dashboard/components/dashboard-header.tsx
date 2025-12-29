'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string | null;
  userEmail: string;
}

/**
 * Dashboard Header Component
 *
 * Displays a personalized greeting and global search bar.
 * Matches the design from general-dashboard-after-login.png.
 *
 * Features:
 * - Personalized greeting: "Hola, [User Name]!"
 * - Falls back to email if name is not available
 * - Global search bar placeholder
 * - Animated card entrance with framer-motion
 * - Responsive design
 */
export function DashboardHeader({ userName, userEmail }: DashboardHeaderProps) {
  const displayName = userName || userEmail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          Hola, {displayName}!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Welcome back to Lanzate</p>
      </div>

      {/* Global Search Bar */}
      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <div className="p-4">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            Looking for something?
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Products, orders, customers..."
              className="w-full rounded-md border border-input bg-background px-10 py-2.5 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
