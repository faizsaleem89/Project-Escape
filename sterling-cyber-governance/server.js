import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3003;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sterling Cyber Governance running on port ${PORT}`);
  console.log(`Public URL: https://3003-ib0cjqxs8dd6zdfu8bdtu-e0a53cdc.us2.manus.computer`);
});
