import type { Metadata } from "next";
import { GeistSans, GeistMono } from 'geist/font';
import { TimerProvider } from "@/context/TimerContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Timer Management",
  description: "A simple timer management application",
};

// Define font variables
const geistSans = GeistSans;
const geistMono = GeistMono;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TimerProvider>
          {children}
        </TimerProvider>
      </body>
    </html>
  );
}
