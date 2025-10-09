// This service handles PDF uploads and uses Mozilla's PDF.js for viewing
// It uses a sample PDF for demonstration purposes

// Mozilla's PDF.js viewer URL
const PDF_JS_VIEWER = 'https://mozilla.github.io/pdf.js/web/viewer.html';

// Sample PDF URL that's publicly accessible
const SAMPLE_PDF_URL = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

// Storage for uploaded PDFs
const uploadedPDFs: Record<string, { 
  id: string;
  name: string; 
  url: string;
  uploadDate: Date;
}> = {};

/**
 * Upload a PDF file and generate a viewer URL
 * @param file The PDF file to upload
 * @returns A promise that resolves to the URL of the uploaded PDF
 */
export const uploadPDF = async (file: File): Promise<{ url: string; id: string }> => {
  return new Promise((resolve) => {
    // Generate a unique ID for the PDF
    const id = generateUniqueId();
    
    // For demonstration purposes, we'll use a sample PDF that's publicly accessible
    // In a real app, you would upload the file to a server and get back a public URL
    
    // Create a URL that will work with Mozilla's PDF.js viewer
    const url = `${PDF_JS_VIEWER}?file=${encodeURIComponent(SAMPLE_PDF_URL)}`;
    
    // Store the PDF in our storage
    uploadedPDFs[id] = {
      id,
      name: file.name,
      url,
      uploadDate: new Date()
    };
    
    console.log(`PDF uploaded with ID: ${id}`);
    
    // Resolve with the URL and ID
    resolve({ url, id });
  });
};

/**
 * Get a PDF by its ID
 * @param id The ID of the PDF to get
 * @returns The PDF object, or null if not found
 */
export const getPDF = (id: string) => {
  return uploadedPDFs[id] || null;
};

/**
 * Generate a unique ID for a PDF
 * @returns A unique ID string
 */
const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Get the URL for viewing a PDF
 * @param id The ID of the PDF to view
 * @returns The URL for viewing the PDF
 */
export const getViewUrl = (id: string): string => {
  const pdf = getPDF(id);
  if (pdf) {
    return pdf.url; // Return the Mozilla PDF.js viewer URL
  }
  // Fallback to a default PDF viewer URL with the sample PDF
  return `${PDF_JS_VIEWER}?file=${encodeURIComponent(SAMPLE_PDF_URL)}`;
};

/**
 * Get the URL for a QR code that links to a PDF
 * @param id The ID of the PDF to link to
 * @returns The URL for the QR code
 */
export const getQRCodeUrl = (id: string): string => {
  // For QR codes, we'll use the Mozilla PDF.js viewer directly
  // This ensures the PDF can be viewed on any device without requiring our app
  const pdf = getPDF(id);
  if (pdf) {
    // Return the Mozilla PDF.js viewer URL directly
    return pdf.url;
  }
  
  // Fallback to a default PDF viewer URL with the sample PDF
  return `${PDF_JS_VIEWER}?file=${encodeURIComponent(SAMPLE_PDF_URL)}`;
};