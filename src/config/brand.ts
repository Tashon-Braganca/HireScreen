// ─── Brand Constants ───
// Single source of truth for product branding.
// Change these values to rename the product everywhere.

export const BRAND_NAME = "CandidRank";
export const BRAND_LOGO_LETTER = "C";
export const BRAND_TAGLINE = "AI-Powered Resume Intelligence";
export const BRAND_DOMAIN = "candidrank.com";

export const BRAND_META = {
    title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    description:
        "Transform your hiring process with AI-powered resume screening. Find exceptional talent in seconds, not hours.",
    openGraph: {
        title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
        description:
            "Upload resumes. Ask questions in plain English. Get ranked candidates with cited proof.",
        siteName: BRAND_NAME,
    },
    twitter: {
        card: "summary_large_image" as const,
        title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
        description:
            "Upload resumes. Ask questions in plain English. Get ranked candidates with cited proof.",
    },
};
