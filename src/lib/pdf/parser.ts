import { extractText } from "unpdf";

interface PDFParseResult {
  text: string;
  numPages: number;
}

/**
 * Parse PDF buffer and extract text content
 * Uses unpdf - specifically built for serverless/edge environments
 */
export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  try {
    // Convert Buffer to Uint8Array
    const data = new Uint8Array(buffer);
    
    // Extract text using unpdf
    const result = await extractText(data, { mergePages: true });
    
    // Get full text - when mergePages is true, result.text is a string
    const text = result.text as string;
    
    return {
      text,
      numPages: result.totalPages,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
