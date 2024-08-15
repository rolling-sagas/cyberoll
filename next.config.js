import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

// ANALYZE=true pnpm build
import BundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

const nextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "rollingsagas.com",
        "dev.rollingsagas.pages.dev",
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        port: "",
        pathname: "**",
      },
    ],
    minimumCacheTTL: 60,
  },
};

// export default nextConfig;
export default withBundleAnalyzer(nextConfig)
