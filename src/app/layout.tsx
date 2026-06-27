import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { GoogleAnalytics } from '@next/third-parties/google'
import { dark } from '@clerk/themes'
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Freelance Contract & Invoice Generator | Sign by HackArena",
  description: "Stop paying just to send a contract. Generate client agreements, collect e-signatures, and send invoices for free. The ultimate Bonsai alternative.",
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
