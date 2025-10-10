import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'uploads'),
      keepExtensions: true,
    });

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await fs.access(uploadsDir);
    } catch (error) {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          res.status(500).json({ error: 'Error uploading file' });
          return resolve(true);
        }

        try {
          // Check if file exists and has the expected structure
          if (!files.pdf || !Array.isArray(files.pdf) || !files.pdf[0]) {
            res.status(400).json({ error: 'No PDF file uploaded' });
            return resolve(true);
          }
          
          const file = files.pdf[0];
          const fileId = uuidv4();
          const fileName = `${fileId}${path.extname(file.originalFilename || '.pdf')}`;
          const filePath = path.join(uploadsDir, fileName);

          // Move file to uploads directory with new name
          await fs.rename(file.filepath, filePath);

          // Create URL for accessing the PDF
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.headers.origin}`;
          const pdfUrl = `${baseUrl}/view/${fileId}`;

          // Save to database using Prisma
          const pdf = await prisma.pDF.create({
            data: {
              id: fileId,
              filename: file.originalFilename,
              path: filePath,
              url: pdfUrl,
            },
          });

          res.status(200).json({
            success: true,
            fileId: pdf.id,
            url: pdf.url,
          });
          return resolve(true);
        } catch (error) {
          console.error('Error processing upload:', error);
          res.status(500).json({ error: 'Error processing upload' });
          return resolve(true);
        }
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}