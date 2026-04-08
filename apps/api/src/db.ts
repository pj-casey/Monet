/**
 * Database — SQLite persistence via sql.js (pure JS, no native deps).
 *
 * The database file is stored at ./data/monet.db.
 * On first run, the tables are created automatically.
 *
 * Tables:
 * - designs: stores serialized DesignDocument JSON
 * - preferences: key-value store for user settings
 */

import initSqlJs, { type Database } from 'sql.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const DB_PATH = './data/monet.db';

let db: Database | null = null;

/** Initialize the database — call once at server start */
export async function initDB(): Promise<void> {
  const SQL = await initSqlJs();

  // Load existing DB file or create a new one
  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables if they don't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS designs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT 'Untitled',
      document TEXT NOT NULL,
      thumbnail TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS preferences (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL DEFAULT '',
      oauth_provider TEXT DEFAULT '',
      oauth_id TEXT DEFAULT '',
      created_at TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // ─── Marketplace tables ────────────────────────────────────────
  db.run(`
    CREATE TABLE IF NOT EXISTS marketplace_templates (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Other',
      tags TEXT NOT NULL DEFAULT '[]',
      dimensions_w INTEGER NOT NULL DEFAULT 1080,
      dimensions_h INTEGER NOT NULL DEFAULT 1080,
      document TEXT NOT NULL,
      thumbnail TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      uses INTEGER NOT NULL DEFAULT 0,
      upvotes INTEGER NOT NULL DEFAULT 0,
      staff_pick INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS template_votes (
      user_id TEXT NOT NULL,
      template_id TEXT NOT NULL,
      PRIMARY KEY (user_id, template_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (template_id) REFERENCES marketplace_templates(id) ON DELETE CASCADE
    )
  `);

  saveDB();
}

/** Persist the database to disk */
export function saveDB(): void {
  if (!db) return;
  const dir = dirname(DB_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const data = db.export();
  writeFileSync(DB_PATH, Buffer.from(data));
}

/** Get the database instance */
export function getDB(): Database {
  if (!db) throw new Error('Database not initialized — call initDB() first');
  return db;
}

// ─── Designs CRUD ──────────────────────────────────────────────────

export interface DesignRow {
  id: string;
  name: string;
  document: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
}

/** Get all designs (sorted by last updated) */
export function getAllDesigns(): DesignRow[] {
  const stmt = getDB().prepare('SELECT * FROM designs ORDER BY updated_at DESC');
  const rows: DesignRow[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as unknown as DesignRow);
  }
  stmt.free();
  return rows;
}

/** Get a single design by ID */
export function getDesignById(id: string): DesignRow | null {
  const stmt = getDB().prepare('SELECT * FROM designs WHERE id = ?');
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.getAsObject() as unknown as DesignRow;
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

/** Create or update a design */
export function upsertDesign(row: DesignRow): void {
  getDB().run(
    `INSERT OR REPLACE INTO designs (id, name, document, thumbnail, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [row.id, row.name, row.document, row.thumbnail, row.created_at, row.updated_at],
  );
  saveDB();
}

/** Delete a design by ID */
export function deleteDesignById(id: string): boolean {
  getDB().run('DELETE FROM designs WHERE id = ?', [id]);
  saveDB();
  return true;
}

// ─── Preferences ───────────────────────────────────────────────────

/** Get a preference value */
export function getPreference(key: string): string | null {
  const stmt = getDB().prepare('SELECT value FROM preferences WHERE key = ?');
  stmt.bind([key]);
  if (stmt.step()) {
    const row = stmt.getAsObject() as { value: string };
    stmt.free();
    return row.value;
  }
  stmt.free();
  return null;
}

/** Set a preference value */
export function setPreference(key: string, value: string): void {
  getDB().run(
    'INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)',
    [key, value],
  );
  saveDB();
}

/** Get all preferences as a record */
export function getAllPreferences(): Record<string, string> {
  const stmt = getDB().prepare('SELECT key, value FROM preferences');
  const prefs: Record<string, string> = {};
  while (stmt.step()) {
    const row = stmt.getAsObject() as { key: string; value: string };
    prefs[row.key] = row.value;
  }
  stmt.free();
  return prefs;
}
