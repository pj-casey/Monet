/**
 * User Templates — save and manage reusable templates in IndexedDB.
 *
 * Lets users save their current design as a reusable template with
 * name, category, and tags. Saved templates appear in the template
 * browser alongside the built-in templates.
 *
 * Uses the `idb` library (same pattern as brand-kit storage).
 * Database: monet-user-templates, store: templates.
 */

import { openDB, type IDBPDatabase } from 'idb';
import type { DesignDocument } from '@monet/shared';

const DB_NAME = 'monet-user-templates';
const DB_VERSION = 1;
const STORE_NAME = 'templates';

/** A user-saved template */
export interface UserTemplate {
  id: string;
  name: string;
  category: string;
  tags: string[];
  dimensions: { width: number; height: number };
  document: DesignDocument;
  createdAt: string;
  updatedAt: string;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

/** Generate a simple unique ID */
function generateId(): string {
  return 'utpl-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Save a design as a reusable user template.
 */
export async function saveUserTemplate(
  name: string,
  category: string,
  tags: string[],
  document: DesignDocument,
): Promise<UserTemplate> {
  const now = new Date().toISOString();
  const template: UserTemplate = {
    id: generateId(),
    name,
    category,
    tags,
    dimensions: document.dimensions,
    document,
    createdAt: now,
    updatedAt: now,
  };
  const db = await getDB();
  await db.put(STORE_NAME, template);
  return template;
}

/** Get all user templates, sorted by name */
export async function getAllUserTemplates(): Promise<UserTemplate[]> {
  const db = await getDB();
  const all: UserTemplate[] = await db.getAll(STORE_NAME);
  return all.sort((a, b) => a.name.localeCompare(b.name));
}

/** Delete a user template by ID */
export async function deleteUserTemplate(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
