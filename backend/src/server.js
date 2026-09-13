import express from 'express';
import cors from 'cors';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import syncRoutes from './routes/syncRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize MongoDB connection
connectDB();

// Global Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[Brother Gatekeeper] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ACTIVE',
    service: 'Brother Compliance SaaS Engine',
    timestamp: new Date().toISOString(),
    gatekeepers: {
      exifVerification: 'ONLINE',
      duplicateHashDetection: 'ONLINE',
      telemetrySurveillance: 'ONLINE',
      antiPasteShield: 'ONLINE'
    }
  });
});

// Network LAN & Cloud Discovery endpoint for multi-laptop / multi-device testing
app.get('/api/network-info', (req, res) => {
  const nets = os.networkInterfaces();
  let lanIp = 'localhost';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        lanIp = net.address;
        break;
      }
    }
    if (lanIp !== 'localhost') break;
  }

  const clientPort = 5173;
  const serverPort = PORT;
  
  // Detect public deployment domain (Render, Railway, VPS, or Cloudflare Tunnel)
  const host = req.get('host');
  const isHttps = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https';
  const detectedUrl = `${isHttps ? 'https' : 'http'}://${host}`;
  const cloudUrl = process.env.RENDER_EXTERNAL_URL || process.env.PUBLIC_URL || process.env.TUNNEL_URL;
  const baseUrl = (cloudUrl || detectedUrl).replace(/\/+$/, '');
  const onlineTestUrl = `${baseUrl}/test`;
  const onlineHubUrl = `${baseUrl}/candidate`;

  res.status(200).json({
    success: true,
    lanIp,
    onlineCandidateUrl: onlineTestUrl,
    lanCandidateUrl: onlineTestUrl,
    onlineHubUrl,
    localCandidateUrl: process.env.NODE_ENV === 'production' ? `${baseUrl}/test` : `http://localhost:${clientPort}/test`,
    localAdminUrl: process.env.NODE_ENV === 'production' ? `${baseUrl}/` : `http://localhost:${clientPort}/`,
    serverLanUrl: `http://${lanIp}:${serverPort}`
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tasks/submit', submissionRoutes); // Direct match for prompt POST /api/tasks/submit
app.use('/api/submissions', submissionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/sync', syncRoutes);

// Production Static Serving & SPA Fallback (Unified Deployment)
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  
  // SPA Client-Side Routing Fallback (for /admin, /exercise/english, etc.)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// 404 handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on Brother Compliance server.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Brother Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Compliance Gatekeeper Exception'
  });
});

// Start listening
const PORT = ENV.PORT;
const server = app.listen(PORT, () => {
  console.log(`
  ======================================================
  👁️  BROTHER COMPLIANCE SAAS - CORE ENGINE ONLINE  👁️
  ======================================================
  Port:        http://localhost:${PORT}
  Health:      http://localhost:${PORT}/api/health
  Gatekeepers: Active (EXIF, Hash, Cadence, Telemetry)
  ======================================================
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [Brother Server]: Port ${PORT} is already in use by another process.`);
    console.error(`To resolve: Kill the process using port ${PORT} or specify a different PORT in backend/.env\n`);
    process.exit(1);
  } else {
    console.error('[Brother Server Error]:', err);
  }
});

export default app;
