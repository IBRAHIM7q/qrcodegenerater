// This service handles PDF uploads to our local server
// For Google Drive integration, OAuth2 authentication is required

// Server endpoint (using proxy to avoid CORS issues)
const SERVER_URL = '/api';

// Storage for uploaded PDFs
const uploadedPDFs: Record<string, { 
  id: string;
  name: string; 
  url: string;
  serverFileId: string; // Server file ID
  serverViewUrl: string; // Direct server view URL
  driveFileId: string | null; // Google Drive file ID (null until uploaded)
  driveViewUrl: string | null; // Google Drive view URL (null until uploaded)
  uploadDate: Date;
}> = {};

/**
 * Upload a PDF file to our local server
 * @param file The PDF file to upload
 * @returns A promise that resolves to the URL of the uploaded PDF
 */
export const uploadPDF = async (file: File): Promise<{ url: string; id: string }> => {
  return new Promise((resolve, reject) => {
    try {
      // Create form data for the upload
      const formData = new FormData();
      formData.append('pdf', file);
      
      // Upload to our local server through proxy
      fetch(`${SERVER_URL}/upload`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to upload to server: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        const serverFileId = data.id;
        const serverViewUrl = data.url;
        
        // Store the PDF in our storage
        uploadedPDFs[serverFileId] = {
          id: serverFileId,
          name: file.name,
          url: serverViewUrl,
          serverFileId,
          serverViewUrl,
          driveFileId: null,
          driveViewUrl: null,
          uploadDate: new Date()
        };
        
        console.log(`PDF uploaded to server with ID: ${serverFileId}`);
        
        // Resolve with the URL and ID
        resolve({ url: serverViewUrl, id: serverFileId });
      })
      .catch(error => {
        console.error('Error uploading to server:', error);
        reject(error);
      });
    } catch (error) {
      console.error('Error processing PDF:', error);
      reject(error);
    }
  });
};

/**
 * Simulate uploading a file to Google Drive
 * In a real implementation, this would use OAuth2 authentication
 * @param id The ID of the file to upload to Google Drive
 * @returns A promise that resolves to the Google Drive URL
 */
export const uploadToGoogleDrive = async (id: string): Promise<{ url: string; driveFileId: string }> => {
  return new Promise((resolve, reject) => {
    try {
      // In a real implementation, this would:
      // 1. Authenticate with Google using OAuth2
      // 2. Upload the file to Google Drive
      // 3. Get the Google Drive file ID
      // 4. Make the file publicly accessible
      // 5. Return the Google Drive URL
      
      // For now, we'll simulate this by calling our server endpoint
      fetch(`${SERVER_URL}/upload-to-drive/${id}`, {
        method: 'POST'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to upload to Google Drive simulation: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        const driveFileId = data.driveFileId;
        const driveViewUrl = data.url;
        
        // Update the PDF in our storage
        if (uploadedPDFs[id]) {
          uploadedPDFs[id].driveFileId = driveFileId;
          uploadedPDFs[id].driveViewUrl = driveViewUrl;
        }
        
        console.log(`PDF simulated upload to Google Drive with ID: ${driveFileId}`);
        
        // Resolve with the Google Drive URL and ID
        resolve({ url: driveViewUrl, driveFileId });
      })
      .catch(error => {
        console.error('Error uploading to Google Drive simulation:', error);
        reject(error);
      });
    } catch (error) {
      console.error('Error processing Google Drive upload:', error);
      reject(error);
    }
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
    // Return Google Drive URL if available, otherwise server URL
    return pdf.driveViewUrl || pdf.url;
  }
  // Fallback to an empty string if PDF not found
  return '';
};

/**
 * Get the URL for a QR code that links to a PDF
 * @param id The ID of the PDF to link to
 * @returns The URL for the QR code
 */
export const getQRCodeUrl = (id: string): string => {
  const pdf = getPDF(id);
  if (pdf) {
    // Return Google Drive URL if available, otherwise server URL
    return pdf.driveViewUrl || pdf.serverViewUrl;
  }
  return '';
};

/**
 * Get the direct URL for a PDF
 * @param id The ID of the PDF
 * @returns The direct URL
 */
export const getDirectUrl = (id: string): string => {
  const pdf = getPDF(id);
  if (pdf) {
    // Return Google Drive URL if available, otherwise server URL
    return pdf.driveViewUrl || pdf.serverViewUrl;
  }
  return '';
};