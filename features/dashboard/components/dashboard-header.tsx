'use client';

import { motion } from 'framer-motion';

import { Text } from "@/features/global/components/typography/text/text";
import { Title } from "@/features/global/components/typography/title/title";

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Title size="lg">
            Hola, {displayName}!
          </Title>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Text size="xs">
            Welcome back to Lanzate
          </Text>
        </motion.div>
      </div>
    </motion.div>
  );
}
