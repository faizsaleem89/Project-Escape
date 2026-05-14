import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import apiRoutes from './routes/api.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../dist')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    system: 'Sterling Estate Intelligence',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api', apiRoutes);
app.use('/api/ai', aiRoutes);

// Serve client app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Sterling Estate Intelligence - Live System Ready          ║');
  console.log(`║  Server running on port ${PORT}                               ║`);
  console.log(`║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(39)}║`);
  console.log(`║  Database: ${(process.env.DB_NAME || 'sterling_estate_intelligence').padEnd(44)}║`);
  console.log(`║  Access: http://localhost:${PORT}${' '.repeat(38 - PORT.toString().length)}║`);
  console.log('╚════════════════════════════════════════════════════════════╝\n');
});
