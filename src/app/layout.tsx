import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "Kingadox",
  description: "Experience the future of banking with our secure innovative, and user-friendly platform designed for modern financial needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/kingadox.jpeg" sizes="any" />
        </head>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
