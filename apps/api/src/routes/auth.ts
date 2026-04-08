/**
 * Auth API routes — signup, login, logout, session check.
 *
 * POST /api/auth/signup   — create account with email/password
 * POST /api/auth/login    — login with email/password
 * POST /api/auth/logout   — end current session
 * GET  /api/auth/me       — get current user (or null if guest)
 *
 * OAuth endpoints (require configuration):
 * GET  /api/auth/oauth/google   — redirect to Google OAuth
 * GET  /api/auth/oauth/github   — redirect to GitHub OAuth
 * GET  /api/auth/oauth/callback — handle OAuth callback
 *
 * Session token is sent as a cookie ("session") or Authorization header.
 */

import { Hono } from 'hono';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import {
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword,
  createSession,
  validateSession,
  deleteSession,
} from '../auth.js';

export const authRouter = new Hono();

/** Extract session token from cookie or Authorization header */
function getToken(c: { req: { header: (name: string) => string | undefined }; } & Parameters<Parameters<typeof authRouter.get>[1]>[0]): string | null {
  const cookie = getCookie(c, 'session');
  if (cookie) return cookie;

  const authHeader = c.req.header('Authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);

  return null;
}

// ─── Signup ────────────────────────────────────────────────────────

authRouter.post('/signup', async (c) => {
  const body = await c.req.json();
  const { email, password, name } = body;

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }
  if (password.length < 8) {
    return c.json({ error: 'Password must be at least 8 characters' }, 400);
  }

  // Check if email is already taken
  const existing = findUserByEmail(email);
  if (existing) {
    return c.json({ error: 'An account with this email already exists' }, 409);
  }

  const user = await createUser(email, password, name || '');
  const token = createSession(user.id);

  setCookie(c, 'session', token, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'Lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });

  return c.json({
    user: { id: user.id, email: user.email, name: user.name },
    token,
  }, 201);
});

// ─── Login ─────────────────────────────────────────────────────────

authRouter.post('/login', async (c) => {
  const body = await c.req.json();
  const { email, password } = body;

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  const user = findUserByEmail(email);
  if (!user || !user.password_hash) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const token = createSession(user.id);

  setCookie(c, 'session', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });

  return c.json({
    user: { id: user.id, email: user.email, name: user.name },
    token,
  });
});

// ─── Logout ────────────────────────────────────────────────────────

authRouter.post('/logout', (c) => {
  const token = getToken(c);
  if (token) {
    deleteSession(token);
  }
  deleteCookie(c, 'session', { path: '/' });
  return c.json({ message: 'Logged out' });
});

// ─── Current User ──────────────────────────────────────────────────

authRouter.get('/me', (c) => {
  const token = getToken(c);
  if (!token) {
    return c.json({ user: null });
  }

  const userId = validateSession(token);
  if (!userId) {
    deleteCookie(c, 'session', { path: '/' });
    return c.json({ user: null });
  }

  const user = findUserById(userId);
  if (!user) {
    return c.json({ user: null });
  }

  return c.json({
    user: { id: user.id, email: user.email, name: user.name },
  });
});

// ─── OAuth Stubs ───────────────────────────────────────────────────
// These endpoints need OAuth app credentials configured in .env:
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
//   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

authRouter.get('/oauth/google', (c) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return c.json({ error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env' }, 501);
  }

  const redirectUri = `${getBaseUrl(c)}/api/auth/oauth/callback?provider=google`;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile`;
  return c.redirect(url);
});

authRouter.get('/oauth/github', (c) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return c.json({ error: 'GitHub OAuth not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env' }, 501);
  }

  const redirectUri = `${getBaseUrl(c)}/api/auth/oauth/callback?provider=github`;
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
  return c.redirect(url);
});

authRouter.get('/oauth/callback', (c) => {
  // In a full implementation, this would:
  // 1. Exchange the authorization code for an access token
  // 2. Fetch the user's profile from the provider
  // 3. Find or create a user in our database
  // 4. Create a session and set the cookie
  // 5. Redirect to the frontend
  return c.json({
    error: 'OAuth callback not fully implemented. Configure OAuth credentials in .env to enable.',
  }, 501);
});

function getBaseUrl(c: Parameters<Parameters<typeof authRouter.get>[1]>[0]): string {
  const host = c.req.header('host') ?? 'localhost:3001';
  const proto = c.req.header('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}`;
}
