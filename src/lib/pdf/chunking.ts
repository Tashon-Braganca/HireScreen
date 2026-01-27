export interface TextChunk {
  content: string;
  chunkIndex: number;
  pageNumber: number | null;
}

const CHUNK_SIZE = 500; // tokens (roughly 4 chars per token)
const CHUNK_OVERLAP = 100;

export function chunkText(text: string, pageBreaks?: number[]): TextChunk[] {
  const chunks: TextChunk[] = [];
  const words = text.split(/\s+/);
  const charsPerToken = 4;
  const wordsPerChunk = Math.floor((CHUNK_SIZE * charsPerToken) / 5); // avg 5 chars per word
  const overlapWords = Math.floor((CHUNK_OVERLAP * charsPerToken) / 5);

  let currentIndex = 0;
  let chunkIndex = 0;

  while (currentIndex < words.length) {
    const endIndex = Math.min(currentIndex + wordsPerChunk, words.length);
    const chunkWords = words.slice(currentIndex, endIndex);
    const content = chunkWords.join(' ').trim();

    if (content.length > 0) {
      // Estimate page number based on character position
      let pageNumber: number | null = null;
      if (pageBreaks && pageBreaks.length > 0) {
        const charPosition = words.slice(0, currentIndex).join(' ').length;
        pageNumber = pageBreaks.findIndex((breakPos) => charPosition < breakPos);
        if (pageNumber === -1) pageNumber = pageBreaks.length;
        pageNumber = Math.max(1, pageNumber);
      }

      chunks.push({
        content,
        chunkIndex,
        pageNumber,
      });
      chunkIndex++;
    }

    currentIndex = endIndex - overlapWords;
    if (currentIndex >= words.length - overlapWords) break;
  }

  return chunks;
}

export function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\t/g, ' ')
    .replace(/ {2,}/g, ' ')
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .trim();
}
