import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Split & Pay | Ephemeral",
  description: "Split bills and pay with friends using World ID",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  },
  themeColor: '#00A7B7',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/icon.svg',
    apple: '/images/icon-192.png'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Split & Pay"
  },
  openGraph: {
    title: 'Split & Pay | Ephemeral',
    description: 'Split bills and pay with friends using World ID',
    images: ['/images/icon-512.png']
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ErudaProvider = dynamic(
    () => import("../components/Eruda").then((c) => c.ErudaProvider),
    {
      ssr: false,
    }
  );
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <ErudaProvider>
            <MiniKitProvider>
              {children}
            </MiniKitProvider>
          </ErudaProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
