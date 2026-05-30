import mammoth from 'mammoth';

export async function parseDOCX(buffer: Buffer): Promise<string> {
  // Try Method 1: Clean text extraction via mammoth
  try {
    const result = await mammoth.extractRawText({ buffer });
    if (result && result.value && result.value.trim().length > 0) {
      return result.value;
    }
  } catch (error) {
    console.warn('mammoth parsing failed, attempting binary printable extraction:', error);
  }

  // Try Method 2: Resilient printable UTF-8/ASCII stream parser fallback
  try {
    const ascii = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    const cleaned = ascii.split(/\s+/).filter(w => w.length > 2).join(' ').trim();
    if (cleaned.length > 50) {
      return cleaned;
    }
  } catch (e) {
    console.error('DOCX binary extraction failed:', e);
  }

  throw new Error('Failed to parse DOCX file content. The file might be corrupted or empty.');
}
