import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireScreen | AI-Powered Resume Intelligence",
  description: "Transform your hiring process with AI-powered resume screening. Find exceptional talent in seconds, not hours.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
