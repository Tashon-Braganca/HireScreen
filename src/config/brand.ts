export const BRAND_NAME = "CandidRank";
export const BRAND_LOGO_LETTER = "C";
export const BRAND_TAGLINE = "AI Resume Screening for Technical Hiring";
export const BRAND_DOMAIN = "candidrank.cc";

export const BRAND_META = {
    title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    description:
        "CandidRank helps startup founders and CTOs screen technical candidates 10x faster using AI. Upload resumes, ask questions in plain English, get ranked results with cited proof.",
    openGraph: {
        title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
        description:
            "CandidRank helps startup founders and CTOs screen technical candidates 10x faster using AI. Upload resumes, ask questions in plain English, get ranked results with cited proof.",
        siteName: BRAND_NAME,
    },
    twitter: {
        card: "summary_large_image" as const,
        title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
        description:
            "CandidRank helps startup founders and CTOs screen technical candidates 10x faster using AI. Upload resumes, ask questions in plain English, get ranked results with cited proof.",
    },
};
