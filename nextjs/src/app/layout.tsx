import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google'
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "ThreadCounty - AI-Powered Fabric Analysis",
  description: "Upload a fabric image and receive instant AI-powered thread density analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaID = process.env.NEXT_PUBLIC_GOOGLE_TAG;
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={`${inter.variable} ${jetbrainsMono.variable} dark antialiased`} suppressHydrationWarning>
      {children}
      <Toaster position="top-right" />
      <Analytics />
      { gaID && (
          <GoogleAnalytics gaId={gaID}/>
      )}
    </body>
    </html>
  );
}
