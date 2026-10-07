import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Faça o Raio-X do seu Negócio | Método ENPLICA",
  description:
    "Diagnóstico estratégico das sete áreas fundamentais do seu negócio.",
  icons: {
    icon: "/logos/favaconenplica.jpeg",
  },
  openGraph: {
    title: "Faça o Raio-X do seu Negócio | Método ENPLICA",
    description:
      "Diagnóstico estratégico das sete áreas fundamentais do seu negócio.",
    url: "https://planejamentocriativo.com",
    siteName: "ENPLICA",
    images: [
      {
        url: "https://planejamentocriativo.com/logos/favaconenplica.jpeg",
        width: 1080,
        height: 1080,
        alt: "Faça o Raio-X do seu Negócio | Método ENPLICA",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}