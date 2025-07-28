import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')


const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "api.dicebear.com"
      },
      {
        hostname: "ugsxvnqkbxihxjxchckw.supabase.co"
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
