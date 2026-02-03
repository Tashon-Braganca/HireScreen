import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Disable worker for serverless environment
GlobalWorkerOptions.workerSrc = "";

interface PDFParseResult {
  text: string;
  numPages: number;
}

/**
 * Parse PDF buffer and extract text content
 * Works in serverless environments (Vercel, AWS Lambda, etc.)
 */
export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  try {
    // Convert Buffer to Uint8Array for pdfjs-dist
    const data = new Uint8Array(buffer);
    
    // Load the PDF document
    const loadingTask = getDocument({
      data,
      useSystemFonts: true,
      disableFontFace: true,
    });
    
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    
    // Extract text from all pages
    const textParts: string[] = [];
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text items and join them
      const pageText = textContent.items
        .map((item) => {
          if ("str" in item) {
            return item.str;
          }
          return "";
        })
        .join(" ");
      
      textParts.push(pageText);
    }
    
    const fullText = textParts.join("\n\n");
    
    return {
      text: fullText,
      numPages,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
