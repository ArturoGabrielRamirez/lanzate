'use client';

import { motion } from 'framer-motion';

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-3xl font-bold text-foreground md:text-4xl'
        >
          Hola, {displayName}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-2 text-sm text-muted-foreground"
        >
          Welcome back to Lanzate
        </motion.p>
      </div>
    </motion.div>
  );
}
