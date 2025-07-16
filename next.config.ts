import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images : {
    remotePatterns : [
      {
        hostname : "api.dicebear.com"
      },
      {
        hostname : "ugsxvnqkbxihxjxchckw.supabase.co"
      }
    ]
  }
};

export default nextConfig;
