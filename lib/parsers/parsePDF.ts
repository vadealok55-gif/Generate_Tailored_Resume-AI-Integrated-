import * as pdf from 'pdf-parse';

export async function parsePDF(buffer: Buffer): Promise<string> {
  // Tier 1: Modern pdf-parse Class API (Mehmet Kozan version)
  try {
    const pdfModule = require('pdf-parse');
    const PDFParseClass = pdfModule.PDFParse || (pdfModule.default && pdfModule.default.PDFParse);
    if (PDFParseClass) {
      const parser = new PDFParseClass({ data: buffer });
      const result = await parser.getText();
      if (result && typeof result.text === 'string' && result.text.trim().length > 0) {
        return result.text;
      }
    }
  } catch (err) {
    console.warn('Modern PDFParse class method failed, trying classic method:', err);
  }

  // Tier 2: Classic pdf-parse Function API (adrianjost version)
  try {
    const pdfModule = require('pdf-parse');
    const parseFunc = typeof pdfModule === 'function' ? pdfModule : pdfModule.default;
    if (typeof parseFunc === 'function') {
      const data = await parseFunc(buffer);
      if (data && data.text && data.text.trim().length > 0) {
        return data.text;
      }
    }
  } catch (err) {
    console.warn('Classic pdf-parse function method failed, trying dynamic ES import:', err);
  }

  // Tier 3: ESM Dynamic Import Fallback
  try {
    const parse = typeof pdf === 'function' ? pdf : (pdf as any).default;
    const PDFParseClass = (pdf as any).PDFParse;
    
    if (PDFParseClass) {
      const parser = new PDFParseClass({ data: buffer });
      const result = await parser.getText();
      if (result && typeof result.text === 'string' && result.text.trim().length > 0) {
        return result.text;
      }
    } else if (typeof parse === 'function') {
      const data = await parse(buffer);
      if (data && data.text && data.text.trim().length > 0) {
        return data.text;
      }
    }
  } catch (err) {
    console.warn('ESM Dynamic Import fallback failed, trying direct binary operator extraction:', err);
  }

  // Tier 4: Resilient PDF Text Operator / ASCII Stream Extraction Fallback
  // (Only runs if genuine PDF-to-text parsers fail to ensure we do not ingest raw compressed binary PDF structure)
  try {
    const content = buffer.toString('binary');
    const textBlocks: string[] = [];
    const regex = /\(([^)]+)\)\s*Tj/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (match[1] && match[1].trim().length > 1) {
        textBlocks.push(match[1]);
      }
    }
    
    if (textBlocks.length > 0) {
      const decodedText = textBlocks
        .join(' ')
        .replace(/\\([0-7]{3})/g, (_, c) => String.fromCharCode(parseInt(c, 8)))
        .replace(/\\r|\\n/g, ' ')
        .trim();
      if (decodedText.length > 50) {
        return decodedText;
      }
    }
  } catch (e) {
    console.error('Binary stream extraction fallback failed:', e);
  }

  throw new Error('Failed to parse PDF file content. The file might be encrypted, empty, or corrupted.');
}
