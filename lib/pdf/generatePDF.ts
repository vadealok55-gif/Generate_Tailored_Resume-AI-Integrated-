export async function generatePDF(projectId: string, templateId: string): Promise<Buffer> {
  // In production, this loads Handlebars, renders template.html with content data,
  // and launches headless Chrome with Puppeteer.
  return Buffer.from('');
}
