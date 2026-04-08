/**
 * Auth middleware — checks for a valid session on protected routes.
 *
 * Reads the session token from:
 * 1. The "session" cookie (set by login/signup)
 * 2. The Authorization header (Bearer <token>)
 *
 * If valid, sets c.set('userId', ...) for downstream handlers.
 * If not valid, returns 401 Unauthorized.
 */

import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { validateSession, findUserById } from '../auth.js';

/**
 * Middleware that requires authentication.
 * Returns 401 if no valid session is found.
 */
export const requireAuth = createMiddleware(async (c, next) => {
  const token = getCookie(c, 'session') ?? c.req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  const userId = validateSession(token);
  if (!userId) {
    return c.json({ error: 'Invalid or expired session' }, 401);
  }

  const user = findUserById(userId);
  if (!user) {
    return c.json({ error: 'User not found' }, 401);
  }

  c.set('userId', userId);
  c.set('userEmail', user.email);
  await next();
});

/**
 * Middleware that optionally reads auth but doesn't require it.
 * Sets c.get('userId') if authenticated, or undefined if guest.
 */
export const optionalAuth = createMiddleware(async (c, next) => {
  const token = getCookie(c, 'session') ?? c.req.header('Authorization')?.replace('Bearer ', '');

  if (token) {
    const userId = validateSession(token);
    if (userId) {
      c.set('userId', userId);
    }
  }

  await next();
});
