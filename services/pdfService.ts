// This service handles PDF uploads and uses PDF.js for viewing
// It creates data URLs from the uploaded files

// Public PDF.js viewer URL
const PDF_JS_VIEWER = 'https://mozilla.github.io/pdf.js/web/viewer.html';

// Storage for uploaded PDFs
const uploadedPDFs: Record<string, { 
  id: string;
  name: string; 
  url: string;
  dataUrl: string; // Base64 data URL of the PDF
  uploadDate: Date;
}> = {};

/**
 * Upload a PDF file and create a data URL
 * @param file The PDF file to upload
 * @returns A promise that resolves to the URL of the uploaded PDF
 */
export const uploadPDF = async (file: File): Promise<{ url: string; id: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        // Get the file data as base64
        const dataUrl = event.target?.result as string;
        
        // Generate a unique ID for the PDF
        const id = generateUniqueId();
        
        // Create a URL that will work with PDF.js viewer
        // For direct viewing, we'll use the data URL directly
        const url = dataUrl;
        
        // Store the PDF in our storage
        uploadedPDFs[id] = {
          id,
          name: file.name,
          url,
          dataUrl,
          uploadDate: new Date()
        };
        
        console.log(`PDF uploaded with ID: ${id}`);
        
        // Resolve with the URL and ID
        resolve({ url, id });
      } catch (error) {
        console.error('Error processing PDF:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(error);
    };
    
    // Read the file as a data URL (base64)
    reader.readAsDataURL(file);
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
    return pdf.dataUrl; // Return the data URL directly
  }
  // Fallback to an empty string if the ID is not found
  return '';
};

/**
 * Get the URL for a QR code that links to a PDF
 * @param id The ID of the PDF to link to
 * @returns The URL for the QR code
 */
export const getQRCodeUrl = (id: string): string => {
  // Create a URL that will open the PDF viewer page with the PDF ID
  return `${window.location.origin}/view-pdf?id=${id}`;
};