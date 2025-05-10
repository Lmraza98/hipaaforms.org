import 'dotenv/config';
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import TrpcProvider from "./_trpc/Provider";
import ClientSessionProvider from './components/ClientSessionProvider'; // Adjust path as needed

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HIPAAForms.org - HIPAA-Compliant Medical Forms',
  description: 'Download, customize, and securely manage healthcare forms that keep your practice compliant and your patients\' data protected.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} scroll-smooth`}>
      <body className={`${inter.variable} antialiased`}>
        <ClientSessionProvider>
          <TrpcProvider>
            {children}
          </TrpcProvider>
        </ClientSessionProvider>
        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ""} />
      </body>
    </html>
  );
}
