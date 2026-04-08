/**
 * Brand Kit — persistence and types for brand kits.
 *
 * A brand kit stores a company's visual identity:
 * - Colors: up to 12 brand colors
 * - Fonts: heading, subheading, body font names
 * - Logos: uploaded images stored as base64 data URLs
 *
 * Multiple brand kits can be saved (e.g., "Personal", "Client A").
 * The active kit's colors appear at the top of every color picker.
 */

import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'monet-brands';
const DB_VERSION = 1;
const STORE_NAME = 'brand-kits';

/** A single brand kit */
export interface BrandKit {
  id: string;
  name: string;
  colors: string[];
  fonts: {
    heading: string;
    subheading: string;
    body: string;
  };
  logos: BrandLogo[];
  updatedAt: string;
}

/** A logo stored as a base64 data URL */
export interface BrandLogo {
  id: string;
  name: string;
  dataUrl: string;
}

/** Default empty brand kit */
export function createEmptyKit(name: string = 'My Brand'): BrandKit {
  return {
    id: generateId(),
    name,
    colors: [],
    fonts: { heading: 'Inter', subheading: 'Inter', body: 'Inter' },
    logos: [],
    updatedAt: new Date().toISOString(),
  };
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

// ─── IndexedDB ─────────────────────────────────────────────────────

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

export async function saveBrandKit(kit: BrandKit): Promise<void> {
  kit.updatedAt = new Date().toISOString();
  const db = await getDB();
  await db.put(STORE_NAME, kit);
}

export async function getBrandKit(id: string): Promise<BrandKit | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

export async function getAllBrandKits(): Promise<BrandKit[]> {
  const db = await getDB();
  const all = await db.getAll(STORE_NAME);
  return all.sort((a, b) => a.name.localeCompare(b.name));
}

export async function deleteBrandKit(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

// ─── Active kit tracking ───────────────────────────────────────────

const ACTIVE_KEY = 'monet-active-brand-kit-id';

export function getActiveKitId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveKitId(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}

// ─── Import / Export ───────────────────────────────────────────────

export function exportBrandKitFile(kit: BrandKit): void {
  const json = JSON.stringify(kit, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${kit.name}.brandkit.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importBrandKitFile(): Promise<BrandKit | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) { resolve(null); return; }
      try {
        const text = await file.text();
        const kit = JSON.parse(text) as BrandKit;
        if (!kit.name || !kit.colors || !kit.fonts) throw new Error('Invalid');
        // Assign a new ID so it doesn't overwrite existing kits
        kit.id = generateId();
        kit.updatedAt = new Date().toISOString();
        resolve(kit);
      } catch {
        alert('Invalid brand kit file.');
        resolve(null);
      }
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
}
