import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AidPath | Berkeley student support",
  description: "Find a clear next step for food, housing, and financial support at UC Berkeley.",
  icons: {
    icon: "/favicon.svg?v=9",
    shortcut: "/favicon.svg?v=9",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
