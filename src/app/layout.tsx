import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GuideAvatar from "./components/GuideAvatar";
import GuideProvider from "./context/GuideContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Órbita - Orientación Vocacional",
  description: "Plataforma de orientación vocacional para estudiantes peruanos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GuideProvider>
          {children}
          <GuideAvatar />
        </GuideProvider>
      </body>
    </html>
  );
}
