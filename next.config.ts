import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    serverActions: {
      // Photo submissions are compressed client-side to about 3MB; keep this
      // under Vercel's 4.5MB request limit.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
