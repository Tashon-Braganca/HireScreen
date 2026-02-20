import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | CandidRank",
  description: "Sign in to CandidRank to access your AI-powered resume screening dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
