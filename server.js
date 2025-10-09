import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3009;

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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
app.post('/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Generate a unique ID for the file
  const fileId = uuidv4();
  
  // Store file metadata
  fileRegistry[fileId] = {
    id: fileId,
    originalName: req.file.originalname,
    fileName: req.file.filename,
    path: req.file.path,
    uploadDate: new Date(),
    url: `http://localhost:${PORT}/uploads/${req.file.filename}`,
    // This is where we would store the Google Drive ID if we had OAuth2
    driveFileId: null,
    driveViewUrl: null
  };

  // Return the file URL and ID
  res.json({
    id: fileId,
    url: fileRegistry[fileId].url
  });
});

// Simulate Google Drive upload (in a real implementation, this would use OAuth2)
app.post('/upload-to-drive/:id', (req, res) => {
  const fileId = req.params.id;
  const fileData = fileRegistry[fileId];
  
  if (!fileData) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // In a real implementation, this would:
  // 1. Authenticate with Google using OAuth2
  // 2. Upload the file to Google Drive
  // 3. Get the Google Drive file ID
  // 4. Make the file publicly accessible
  // 5. Return the Google Drive URL
  
  // For now, we'll simulate this by generating a Google Drive-like URL
  const driveFileId = `simulated-drive-id-${fileId}`;
  const driveViewUrl = `https://drive.google.com/file/d/${driveFileId}/view`;
  
  // Update the file metadata
  fileRegistry[fileId].driveFileId = driveFileId;
  fileRegistry[fileId].driveViewUrl = driveViewUrl;
  
  res.json({
    id: fileId,
    url: driveViewUrl,
    driveFileId: driveFileId
  });
});

// Get file info endpoint
app.get('/file/:id', (req, res) => {
  const fileId = req.params.id;
  const fileData = fileRegistry[fileId];
  
  if (!fileData) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.json(fileData);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`For Google Drive integration, you would need to implement OAuth2 authentication`);
  console.log(`This server provides the backend infrastructure needed for that implementation`);
});