import createNextIntlPlugin from 'next-intl/plugin';

import type { NextConfig } from "next";

const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')


const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["lanzate.app","lodemauri.lanzate.app","www.lanzate.app"],
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  devIndicators : {
    position : "top-right"
  },
  images: {
    remotePatterns: [
      {
        hostname: "api.dicebear.com"
      },
      {
        hostname: "ugsxvnqkbxihxjxchckw.supabase.co"
      },
      {
        hostname: "picsum.photos"
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }

    return config
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
