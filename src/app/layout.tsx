import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";
import { Cormorant_Garamond, Source_Serif_4, Outfit, Fira_Code } from "next/font/google";

const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const fontBody = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
});

const fontUi = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ui",
});

const fontMono = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

const PostHogProvider = dynamic(
  () => import("@/lib/analytics/posthog").then((m) => ({ default: m.PostHogProvider })),
  { ssr: false }
);

export const metadata: Metadata = {
  metadataBase: new URL("https://candidrank.cc"),
  title: "CandidRank | AI Resume Screening for Technical Hiring",
  description: "Screen technical candidates 10x faster. Upload resumes, ask questions in plain English, get AI-ranked results with cited proof.",
  keywords: ["AI resume screening", "technical hiring", "resume ranking", "ATS alternative", "startup hiring tool"],
  alternates: {
    canonical: "https://candidrank.cc",
  },
  openGraph: {
    title: "CandidRank | AI Resume Screening for Technical Hiring",
    description: "Screen technical candidates 10x faster. Upload resumes, ask questions in plain English, get AI-ranked results with cited proof.",
    siteName: "CandidRank",
    url: "https://candidrank.cc",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CandidRank - AI Resume Screening",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CandidRank | AI Resume Screening for Technical Hiring",
    description: "Screen technical candidates 10x faster. Upload resumes, ask questions in plain English, get AI-ranked results with cited proof.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable} ${fontUi.variable} ${fontMono.variable}`}>
      <body className={`${fontUi.className} antialiased`} suppressHydrationWarning>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
