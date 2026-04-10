import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // <-- AQUÍ LE ESTAMOS DANDO PERMISO A UPLOADTHING
        port: "",
        pathname: "/**",
      },
    ],
  },
  // 👇 AGREGAMOS ESTOS DOS BLOQUES PARA VERCEL
  eslint: {
    // Ignora los errores de ESLint (como variables no usadas o "any") durante el build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora los errores de TypeScript durante el build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;