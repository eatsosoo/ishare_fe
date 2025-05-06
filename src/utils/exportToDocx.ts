import { Document, Packer, Paragraph } from 'docx';

export async function exportHtmlToDocx(htmlContent: string, fileName: string = 'document.docx') {
  try {
    // Create a new document with metadata to avoid potential issues
    const doc = new Document({
      creator: 'iShare',
      title: 'Exported Document',
      description: 'Document exported from HTML content',
      sections: [], // Add an empty sections array to satisfy the required property
    });

    // Convert HTML content to plain text (basic example)
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlContent, 'text/html');
    const textContent = htmlDoc.body.innerText;

    // Add the text content to the document
    const paragraphs = textContent.split('\n').map((line) => new Paragraph(line));
    doc.addSection({ children: paragraphs });

    // Generate the .docx file
    const blob = await Packer.toBlob(doc);

    // Trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  } catch (error) {
    console.error('Error exporting document:', error);
    alert('An error occurred while exporting the document. Please try again.');
  }
}
