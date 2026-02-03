const fs = require('fs');
const path = require('path');

// Fix for pdf-parse library that tries to load test files
// This creates a minimal dummy PDF file in the expected location
const testDir = path.join(__dirname, '..', 'node_modules', 'pdf-parse', 'test', 'data');
const testFile = path.join(testDir, '05-versions-space.pdf');

// Minimal valid PDF content
const minimalPdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>
endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer
<< /Size 4 /Root 1 0 R >>
startxref
193
%%EOF`;

try {
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  if (!fs.existsSync(testFile)) {
    fs.writeFileSync(testFile, minimalPdf);
    console.log('Created pdf-parse test file workaround');
  }
} catch (err) {
  // Ignore errors - this is just a workaround
  console.log('Note: Could not create pdf-parse test file (may not be needed)');
}
