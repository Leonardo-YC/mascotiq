import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { esES } from "@clerk/localizations";
import { ChatbotIA } from "@/components/chat/ChatbotIA";
import { Analytics } from "@vercel/analytics/react";
import "@uploadthing/react/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mascotiq | Nutrición Inteligente para tu Mascota",
  description: "Suscripciones nutricionales inteligentes basadas en la etapa biológica real de tu mascota. Descubre exactamente qué necesita hoy.",
  keywords: ["nutrición para mascotas", "comida para perros", "suplementos para gatos", "mascotas senior", "suscripción mascotas", "bienestar animal"],
  openGraph: {
    title: "Mascotiq | Bienestar Animal",
    description: "Descubre exactamente qué necesita tu mascota según su especie, raza, peso y edad real.",
    url: "https://www.mascotiq.com",
    siteName: "Mascotiq",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mascotiq - Diagnóstico Nutricional Gratuito",
      },
    ],
    locale: "es",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mascotiq | Nutrición Inteligente",
    description: "Suscripciones nutricionales inteligentes basadas en la etapa biológica real de tu mascota.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      localization={esES as any}
      appearance={{
        variables: {
          colorPrimary: 'hsl(158, 64%, 39%)',
          colorText: 'hsl(222.2, 84%, 4.9%)',
        },
        layout: {
          logoImageUrl: '/logo.svg',
          logoPlacement: 'inside',
        },
        elements: {
          logoImage: "w-20 h-20 object-contain mx-auto",
        }
      }}
    >
      <html lang="es" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
          
          {children}

          <ChatbotIA />
          <Analytics />
          
        </body>
      </html>
    </ClerkProvider>
  );
}