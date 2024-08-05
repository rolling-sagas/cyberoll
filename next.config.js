import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

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
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "img.daisyui.com",
        port: "",
        pathname: "**",
      },
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

export default nextConfig;
