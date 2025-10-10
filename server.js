import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Prisma client
const prisma = new PrismaClient();

const app = express();
const PORT = 3009;

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.sendStatus(200);
});

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadDir));

// Middleware to parse JSON
app.use(express.json());

// In-memory storage for file metadata (in production, use a database)
const fileRegistry = {};

// Upload endpoint
app.post('/upload', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Generate a unique ID for the file
    const fileId = uuidv4();
    
    // Read the file content
    const fileContent = await fs.promises.readFile(req.file.path);
    
    // Create a URL for accessing the PDF
    const pdfUrl = `${req.protocol}://${req.get('host')}/pdf/${fileId}`;
    
    // Store in database using Prisma
    const pdf = await prisma.pDF.create({
      data: {
        id: fileId,
        filename: req.file.originalname,
        content: fileContent,
        fileSize: req.file.size,
        url: pdfUrl
      }
    });
    
    // Delete the temporary file since we've stored it in the database
    await fs.promises.unlink(req.file.path);
    
    // Return the file URL and ID
    res.json({
      id: pdf.id,
      url: pdf.url
    });
  } catch (error) {
    console.error('Error storing PDF:', error);
    res.status(500).json({ error: 'Failed to store PDF' });
  }
});

// Get PDF endpoint - returns the actual PDF file
app.get('/pdf/:id', async (req, res) => {
  const fileId = req.params.id;
  
  try {
    // Find the PDF in the database
    const pdf = await prisma.pDF.findUnique({
      where: { id: fileId }
    });
    
    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    
    // Set appropriate headers
    res.setHeader('Content-Type', pdf.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${pdf.filename}"`);
    res.setHeader('Content-Length', pdf.fileSize);
    
    // Send the PDF content
    res.send(Buffer.from(pdf.content));
  } catch (error) {
    console.error('Error retrieving PDF:', error);
    res.status(500).json({ error: 'Failed to retrieve PDF' });
  }
});

// Get PDF info endpoint
app.get('/file/:id', async (req, res) => {
  const fileId = req.params.id;
  
  try {
    // Find the PDF in the database
    const pdf = await prisma.pDF.findUnique({
      where: { id: fileId },
      select: {
        id: true,
        filename: true,
        fileSize: true,
        url: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    
    res.json(pdf);
  } catch (error) {
    console.error('Error retrieving PDF info:', error);
    res.status(500).json({ error: 'Failed to retrieve PDF info' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});