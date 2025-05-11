import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Necesario para generar archivos estáticos
  basePath: '/nombre-de-tu-repositorio', // Reemplaza con el nombre de tu repositorio
  images: {
    unoptimized: true, // Necesario para exportación estática
  },
};

export default nextConfig;
