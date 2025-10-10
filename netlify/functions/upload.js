const { PrismaClient } = require('@prisma/client');
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');

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
    const { fields, files } = await parseFormData(event);
    
    if (!files.pdf) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No PDF file uploaded' })
      };
    }

    const file = files.pdf;
    
    // Generate a unique ID for the file
    const fileId = uuidv4();
    
    // Create a URL for accessing the PDF
    const pdfUrl = `${process.env.URL || 'https://your-site.netlify.app'}/pdf/${fileId}`;
    
    // Store in database using Prisma
    const pdf = await prisma.pDF.create({
      data: {
        id: fileId,
        filename: file.originalFilename,
        content: file.buffer,
        fileSize: file.size,
        mimeType: file.mimetype || 'application/pdf',
        url: pdfUrl
      }
    });
    
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
      body: JSON.stringify({ error: 'Failed to store PDF' })
    };
  }
};

// Helper function to parse multipart form data
function parseFormData(event) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    
    form.parse(event, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}