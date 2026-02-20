export interface TextChunk {
  content: string;
  chunkIndex: number;
  pageNumber: number | null;
}

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 100;
const MIN_CHUNK_LENGTH = 50;

export function chunkText(text: string, pageBreaks?: number[]): TextChunk[] {
  const chunks: TextChunk[] = [];
  const words = text.split(/\s+/);
  const charsPerToken = 4;
  const wordsPerChunk = Math.floor((CHUNK_SIZE * charsPerToken) / 5);
  const overlapWords = Math.floor((CHUNK_OVERLAP * charsPerToken) / 5);

  let currentIndex = 0;
  let chunkIndex = 0;

  while (currentIndex < words.length) {
    const endIndex = Math.min(currentIndex + wordsPerChunk, words.length);
    const chunkWords = words.slice(currentIndex, endIndex);
    const content = chunkWords.join(' ').trim();

    if (content.length >= MIN_CHUNK_LENGTH) {
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
    
    if (endIndex >= words.length) {
      break;
    }
  }

  // Add any remaining words as a final chunk
  const lastProcessedIndex = Math.max(0, words.length - wordsPerChunk + overlapWords);
  if (lastProcessedIndex < words.length) {
    const remainingWords = words.slice(lastProcessedIndex);
    const remainingContent = remainingWords.join(' ').trim();
    
    if (remainingContent.length >= MIN_CHUNK_LENGTH && 
        (chunks.length === 0 || chunks[chunks.length - 1].content !== remainingContent)) {
      let pageNumber: number | null = null;
      if (pageBreaks && pageBreaks.length > 0) {
        const charPosition = words.slice(0, lastProcessedIndex).join(' ').length;
        pageNumber = pageBreaks.findIndex((breakPos) => charPosition < breakPos);
        if (pageNumber === -1) pageNumber = pageBreaks.length;
        pageNumber = Math.max(1, pageNumber);
      }

      chunks.push({
        content: remainingContent,
        chunkIndex,
        pageNumber,
      });
    }
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
