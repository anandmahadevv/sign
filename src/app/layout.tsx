import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import "./globals.css";

export const metadata: Metadata = {
  title: "Sign by HackArena",
  description: "Generate and sign client agreements effortlessly.",
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
