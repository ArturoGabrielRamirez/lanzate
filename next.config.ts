import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Configure next-intl plugin to load translations
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // React compiler is disabled for now due to compatibility issues with Turbopack
  // reactCompiler: true,

  // Server Actions configuration
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },

  // Image configuration for Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },

  // Transpile packages
  transpilePackages: ["yup"],

  // Turbopack configuration (empty to silence warning, Prisma plugin will be added when needed)
  turbopack: {},
};

// Wrap Next.js config with next-intl plugin
export default withNextIntl(nextConfig);
