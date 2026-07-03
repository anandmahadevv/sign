import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { GoogleAnalytics } from '@next/third-parties/google'
import { dark } from '@clerk/themes'
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Freelance Contract & Invoice Generator | Sign by HackArena",
  description: "Stop paying just to send a contract. Generate client agreements, collect e-signatures, and send invoices for free. The ultimate Bonsai alternative.",
  keywords: ["freelance contracts", "invoice generator", "free e-signatures", "agency OS", "client agreements", "Bonsai alternative"],
  openGraph: {
    title: "Free Freelance Contract & Invoice Generator | Sign by HackArena",
    description: "Generate client agreements, collect e-signatures, and send invoices for free in 3 clicks.",
    url: "https://sign.hackarena.com", // Replace with your actual domain
    siteName: "Sign by HackArena",
    images: [
      {
        url: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85", // The hero image you have
        width: 1200,
        height: 630,
        alt: "Sign by HackArena Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Freelance Contract & Invoice Generator",
    description: "Stop paying just to send a contract. Generate client agreements, collect e-signatures, and send invoices for free.",
    images: ["https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85"], // Matches OG image
  },
};

const clerkAppearance: any = {
  baseTheme: dark,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <GoogleAnalytics gaId="G-4S5V64P605" />
        <head>
          <link href="https://db.onlinewebfonts.com/c/bb5de19d87c09a95216dc6ccd96e37c6?family=Nimbus+Sans+TW01" rel="stylesheet" type="text/css"/>
        </head>
        <body
          className="antialiased"
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
