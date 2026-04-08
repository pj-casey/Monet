/**
 * Monet API Server
 *
 * A lightweight REST API for cloud-syncing designs and preferences.
 * Built with Hono (fast HTTP framework) and SQLite via sql.js.
 *
 * The frontend works fully without this server — it's an opt-in
 * enhancement for syncing designs across devices.
 *
 * Endpoints:
 * - POST /api/auth/signup, login, logout; GET /api/auth/me
 * - GET/POST/PUT/DELETE  /api/designs     — design CRUD
 * - GET/PUT              /api/preferences — user settings
 * - GET                  /api/health      — health check
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { initDB } from './db.js';
import { initCollaboration } from './collab.js';
import { authRouter } from './routes/auth.js';
import { designsRouter } from './routes/designs.js';
import { preferencesRouter } from './routes/preferences.js';
import { sharingRouter } from './routes/sharing.js';
import { marketplaceRouter } from './routes/marketplace.js';

const app = new Hono();

// ─── CORS — allow the frontend dev server with credentials ──────────
app.use(
  '/api/*',
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies for session auth
  }),
);

// ─── Health check ──────────────────────────────────────────────────
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ────────────────────────────────────────────────────────
app.route('/api/auth', authRouter);
app.route('/api/designs', designsRouter);
app.route('/api/preferences', preferencesRouter);
app.route('/api/share', sharingRouter);
app.route('/api/marketplace', marketplaceRouter);

// ─── Start server ──────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? '3001', 10);

async function start() {
  await initDB();
  console.log(`Monet API server running at http://localhost:${PORT}`);
  console.log('Auth endpoints:');
  console.log('  POST   /api/auth/signup');
  console.log('  POST   /api/auth/login');
  console.log('  POST   /api/auth/logout');
  console.log('  GET    /api/auth/me');
  console.log('Data endpoints:');
  console.log('  GET    /api/designs');
  console.log('  POST   /api/designs');
  console.log('  PUT    /api/designs/:id');
  console.log('  DELETE /api/designs/:id');
  console.log('  GET    /api/preferences');

  const server = serve({ fetch: app.fetch, port: PORT });
  initCollaboration(server as unknown as import('http').Server);
  console.log('  WebSocket collaboration server active');
}

start();
