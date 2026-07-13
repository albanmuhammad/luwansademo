import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SalesforceProvider from "./components/SalesforceProvider";
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
  title: "JS Luwansa Hotel & Convention Center",
  description: "Demo integrasi Salesforce Personalization dengan Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SalesforceProvider>
          {children}
        </SalesforceProvider>
      </body>
    </html>
  );
}
