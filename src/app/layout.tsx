import type { Metadata } from "next";
import { BRAND_META } from "@/config/brand";
import { PostHogProvider } from "@/lib/analytics/posthog";
import "./globals.css";

export const metadata: Metadata = {
  title: BRAND_META.title,
  description: BRAND_META.description,
  openGraph: BRAND_META.openGraph,
  twitter: BRAND_META.twitter,
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
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
