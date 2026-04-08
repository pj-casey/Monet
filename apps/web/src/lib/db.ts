/**
 * Database — IndexedDB persistence for saved designs.
 *
 * Uses the "idb" library for a promise-based IndexedDB wrapper.
 * Stores designs in an "monet-db" database with a "designs" object store.
 *
 * Each saved design is a DesignDocument plus a thumbnail data URL.
 */

import { openDB, type IDBPDatabase } from 'idb';
import type { DesignDocument } from '@monet/shared';

const DB_NAME = 'monet-db';
const DB_VERSION = 1;
const STORE_NAME = 'designs';

/** A saved design record in IndexedDB */
export interface SavedDesign {
  /** Unique ID (matches DesignDocument.id) */
  id: string;
  /** Display name */
  name: string;
  /** Last modified timestamp (ISO 8601) */
  updatedAt: string;
  /** Created timestamp */
  createdAt: string;
  /** Small preview image as a data URL */
  thumbnail: string;
  /** The full design document */
  document: DesignDocument;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

/** Get or create the database connection */
function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt');
        }
      },
    });
  }
  return dbPromise;
}

/** Save or update a design */
export async function saveDesign(design: SavedDesign): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, design);
}

/** Get a single design by ID */
export async function getDesign(id: string): Promise<SavedDesign | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

/** Get all saved designs, sorted by last modified (newest first) */
export async function getAllDesigns(): Promise<SavedDesign[]> {
  const db = await getDB();
  const all = await db.getAll(STORE_NAME);
  return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Delete a design by ID */
export async function deleteDesign(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

/** Get the most recently edited design */
export async function getLastDesign(): Promise<SavedDesign | undefined> {
  const designs = await getAllDesigns();
  return designs[0];
}

/** Get recent designs (up to N) */
export async function getRecentDesigns(limit: number = 5): Promise<SavedDesign[]> {
  const designs = await getAllDesigns();
  return designs.slice(0, limit);
}

/** Store the ID of the current design being edited */
const CURRENT_KEY = 'monet-current-design-id';

export function setCurrentDesignId(id: string): void {
  localStorage.setItem(CURRENT_KEY, id);
}

export function getCurrentDesignId(): string | null {
  return localStorage.getItem(CURRENT_KEY);
}
