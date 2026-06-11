require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const prisma  = require('./prismaClient');
const internRoutes = require('./routes/internRoutes');
const errorHandler = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ───────────────────────────────────────────────────────────────────
// Allow requests from the frontend (any localhost port during dev)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🚀 DecodeLabs Project 4 — Frontend & Backend Integration API',
    status: 'running',
    endpoints: { interns: '/api/interns' },
  });
});

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/interns', internRoutes);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ───────────────────────────────────────────────────────────────────
async function main() {
  await prisma.$connect();
  console.log('✅ PostgreSQL connected via Prisma');
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`   GET    /api/interns`);
    console.log(`   POST   /api/interns`);
    console.log(`   GET    /api/interns/:id`);
    console.log(`   PUT    /api/interns/:id`);
    console.log(`   DELETE /api/interns/:id`);
    console.log(`   GET    /api/health`);
  });
}

main().catch((e) => { console.error('❌ Failed to start:', e); process.exit(1); });
