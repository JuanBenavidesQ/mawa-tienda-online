import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Analytics from "@/components/Analytics";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPCION =
  "Compra tu entrada a Mawá con descuento y llega directo a la piscina. Piscinas y toboganes, puentes tibetanos, almuerzo incluido. Centro campestre en el Km 37,5 vía Ipiales – Pasto, Nariño.";

// Verificación de dominio de Meta (Configuración del negocio → Dominios →
// etiqueta meta). Se activa poniendo el valor en Vercel; sin él no se emite.
const META_DOMAIN_VERIFICATION = process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Compra tu entrada a Mawá | Piscinas, toboganes y puentes tibetanos",
    template: "%s | Mawá",
  },
  description: DESCRIPCION,
  applicationName: "Tienda Mawá",
  keywords: [
    "Mawá",
    "Mawa campestre",
    "entradas Mawá",
    "piscinas Nariño",
    "toboganes Pasto",
    "puentes tibetanos",
    "pasadía Ipiales",
    "centro campestre Nariño",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: "Mawá",
    title: "Compra tu entrada a Mawá con descuento",
    description: DESCRIPCION,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Vista aérea de Mawá: piscinas, toboganes y hotel en la montaña",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compra tu entrada a Mawá con descuento",
    description: DESCRIPCION,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(META_DOMAIN_VERIFICATION
    ? { verification: { other: { "facebook-domain-verification": META_DOMAIN_VERIFICATION } } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#065f46",
  colorScheme: "light",
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
