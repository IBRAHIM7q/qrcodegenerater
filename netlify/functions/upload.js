const { PrismaClient } = require('@prisma/client');
const { formidable } = require('formidable');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Initialize Prisma client
const prisma = new PrismaClient();

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the multipart form data
    let fields, files;
    try {
      const result = await parseFormData(event);
      fields = result.fields;
      files = result.files;
    } catch (parseError) {
      console.error('Error parsing form data:', parseError);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to parse form data' })
      };
    }
    
    // Check if files exists and has pdf property
    if (!files || !files.pdf) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No PDF file uploaded' })
      };
    }

    // Handle both array and single file formats
    const file = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
    
    // Generate a unique ID for the file
    const fileId = uuidv4();
    
    // Create a URL for accessing the PDF
    const pdfUrl = `${process.env.URL || 'https://your-site.netlify.app'}/pdf/${fileId}`;
    
    // Read file content safely
    let fileContent;
    try {
      if (file.buffer) {
        fileContent = file.buffer;
      } else if (file.filepath) {
        fileContent = await fs.promises.readFile(file.filepath);
      } else {
        throw new Error('No file content available');
      }
    } catch (readError) {
      console.error('Error reading file:', readError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to read uploaded file' })
      };
    }
    
    // Get file size safely
    const fileSize = file.size || (fileContent ? fileContent.length : 0);
    
    // Store in database using Prisma
    let pdf;
    try {
      pdf = await prisma.pDF.create({
        data: {
          id: fileId,
          filename: file.originalFilename || file.originalname || 'uploaded.pdf',
          content: fileContent,
          fileSize: fileSize,
          mimeType: file.mimetype || 'application/pdf',
          url: pdfUrl
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save PDF to database' })
      };
    }
    
    // Return the file URL and ID
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: pdf.id,
        url: pdf.url
      })
    };
  } catch (error) {
    console.error('Error storing PDF:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to store PDF',
        message: error.message || 'Unknown error'
      })
    };
  }
};

// Helper function to parse multipart form data
function parseFormData(event) {
  return new Promise((resolve, reject) => {
    try {
      // Create a proper request-like object that formidable can handle
      const req = {
        headers: event.headers,
        body: Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8')
      };
      
      // Formidable v3 requires a different approach
      const form = formidable({
        keepExtensions: true,
        multiples: true,
        allowEmptyFiles: false,
        maxFileSize: 10 * 1024 * 1024 // 10MB limit
      });
      
      // Configure formidable to handle file uploads properly
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    } catch (error) {
      console.error('Error in parseFormData:', error);
      reject(error);
    }
  });
}