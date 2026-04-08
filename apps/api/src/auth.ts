/**
 * Auth — password hashing and session management.
 *
 * Uses Node.js built-in crypto for:
 * - Password hashing (scrypt — secure, no external deps)
 * - Session token generation (random bytes)
 *
 * Sessions expire after 30 days by default.
 */

import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { getDB, saveDB } from './db.js';

const scryptAsync = promisify(scrypt);
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ─── Password Hashing ──────────────────────────────────────────────

/** Hash a password with a random salt */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString('hex')}`;
}

/** Verify a password against a stored hash */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const hashBuffer = Buffer.from(hash, 'hex');
  return timingSafeEqual(derived, hashBuffer);
}

// ─── User CRUD ─────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  oauth_provider: string;
  oauth_id: string;
  created_at: string;
}

function generateId(): string {
  return randomBytes(12).toString('hex');
}

/** Create a new user with email/password */
export async function createUser(email: string, password: string, name: string): Promise<User> {
  const id = generateId();
  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();

  getDB().run(
    `INSERT INTO users (id, email, name, password_hash, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [id, email.toLowerCase(), name, passwordHash, now],
  );
  saveDB();

  return { id, email: email.toLowerCase(), name, oauth_provider: '', oauth_id: '', created_at: now };
}

/** Find a user by email */
export function findUserByEmail(email: string): (User & { password_hash: string }) | null {
  const stmt = getDB().prepare('SELECT * FROM users WHERE email = ?');
  stmt.bind([email.toLowerCase()]);
  if (stmt.step()) {
    const row = stmt.getAsObject() as unknown as User & { password_hash: string };
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

/** Find a user by ID */
export function findUserById(id: string): User | null {
  const stmt = getDB().prepare('SELECT id, email, name, oauth_provider, oauth_id, created_at FROM users WHERE id = ?');
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.getAsObject() as unknown as User;
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

/** Find or create a user from an OAuth provider */
export function findOrCreateOAuthUser(
  provider: string,
  oauthId: string,
  email: string,
  name: string,
): User {
  // Check if the user already exists by OAuth ID
  const stmt = getDB().prepare('SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ?');
  stmt.bind([provider, oauthId]);
  if (stmt.step()) {
    const row = stmt.getAsObject() as unknown as User;
    stmt.free();
    return row;
  }
  stmt.free();

  // Check if an account with this email already exists
  const existing = findUserByEmail(email);
  if (existing) {
    // Link OAuth to existing account
    getDB().run(
      'UPDATE users SET oauth_provider = ?, oauth_id = ? WHERE id = ?',
      [provider, oauthId, existing.id],
    );
    saveDB();
    return { ...existing, oauth_provider: provider, oauth_id: oauthId };
  }

  // Create new user
  const id = generateId();
  const now = new Date().toISOString();
  getDB().run(
    `INSERT INTO users (id, email, name, password_hash, oauth_provider, oauth_id, created_at)
     VALUES (?, ?, ?, '', ?, ?, ?)`,
    [id, email.toLowerCase(), name, provider, oauthId, now],
  );
  saveDB();

  return { id, email: email.toLowerCase(), name, oauth_provider: provider, oauth_id: oauthId, created_at: now };
}

// ─── Sessions ──────────────────────────────────────────────────────

/** Create a new session for a user, returns the session token */
export function createSession(userId: string): string {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  getDB().run(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
    [token, userId, expiresAt],
  );
  saveDB();

  return token;
}

/** Validate a session token and return the user ID if valid */
export function validateSession(token: string): string | null {
  const stmt = getDB().prepare(
    'SELECT user_id, expires_at FROM sessions WHERE id = ?',
  );
  stmt.bind([token]);

  if (stmt.step()) {
    const row = stmt.getAsObject() as { user_id: string; expires_at: string };
    stmt.free();

    // Check expiration
    if (new Date(row.expires_at) < new Date()) {
      // Expired — clean up
      getDB().run('DELETE FROM sessions WHERE id = ?', [token]);
      saveDB();
      return null;
    }

    return row.user_id;
  }

  stmt.free();
  return null;
}

/** Delete a session (logout) */
export function deleteSession(token: string): void {
  getDB().run('DELETE FROM sessions WHERE id = ?', [token]);
  saveDB();
}

/** Delete all sessions for a user */
export function deleteUserSessions(userId: string): void {
  getDB().run('DELETE FROM sessions WHERE user_id = ?', [userId]);
  saveDB();
}
