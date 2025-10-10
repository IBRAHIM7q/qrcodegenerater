const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get the PDF ID from the path
    const fileId = event.path.split('/').pop();
    
    // Find the PDF in the database
    const pdf = await prisma.pDF.findUnique({
      where: { id: fileId }
    });
    
    if (!pdf) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'PDF not found' })
      };
    }
    
    // Return the PDF content with appropriate headers
    return {
      statusCode: 200,
      headers: {
        'Content-Type': pdf.mimeType || 'application/pdf',
        'Content-Disposition': `inline; filename="${pdf.filename}"`,
        'Content-Length': pdf.fileSize.toString()
      },
      body: pdf.content.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error retrieving PDF:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve PDF' })
    };
  }
};