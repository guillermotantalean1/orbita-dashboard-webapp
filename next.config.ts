import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Necesario para generar archivos estáticos
  basePath: '/orbita-dashboard-webapp', // Este debe ser el nombre exacto de tu repositorio
  images: {
    unoptimized: true, // Necesario para exportación estática
  },
};

export default nextConfig;
