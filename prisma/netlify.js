// This file is used by Netlify to set up Prisma during build
const { execSync } = require('child_process');

// Generate Prisma client
execSync('npx prisma generate', { stdio: 'inherit' });

// Deploy database changes if needed
// In production, you would use a connection string to your actual database
// For this example, we're using the development database
try {
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('Database schema updated successfully');
} catch (error) {
  console.error('Error updating database schema:', error);
  process.exit(1);
}