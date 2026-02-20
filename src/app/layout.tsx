import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
