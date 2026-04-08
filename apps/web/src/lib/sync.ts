/**
 * Sync — pushes and pulls designs between local IndexedDB and the server.
 *
 * Strategy: local-first, server is optional backup.
 * - On save: push to server if logged in
 * - On login: pull from server, merge with local
 * - Conflict: last-write-wins (by updatedAt timestamp),
 *   with a merge prompt if timestamps are within 5 seconds
 */

import { getAllDesigns, saveDesign, type SavedDesign } from './db';

const API_BASE = 'http://localhost:3001';

/** Conflict that needs user resolution */
export interface SyncConflict {
  designId: string;
  designName: string;
  localUpdatedAt: string;
  serverUpdatedAt: string;
}

// ─── Push (local → server) ─────────────────────────────────────────

/** Push a single design to the server. Fails silently if server is down. */
export async function pushDesign(design: SavedDesign): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/designs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        id: design.id,
        name: design.name,
        document: design.document,
        thumbnail: design.thumbnail,
        createdAt: design.createdAt,
      }),
    });
    return res.ok || res.status === 409; // 409 = already exists, use PUT
  } catch {
    return false; // Server not reachable — that's fine
  }
}

/** Push a design update to the server */
export async function pushDesignUpdate(design: SavedDesign): Promise<boolean> {
  try {
    // Try POST first (create), fall back to PUT (update)
    let res = await fetch(`${API_BASE}/api/designs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        id: design.id,
        name: design.name,
        document: design.document,
        thumbnail: design.thumbnail,
        createdAt: design.createdAt,
      }),
    });

    if (res.status === 409 || !res.ok) {
      // Already exists — update it
      res = await fetch(`${API_BASE}/api/designs/${design.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: design.name,
          document: design.document,
          thumbnail: design.thumbnail,
        }),
      });
    }

    return res.ok;
  } catch {
    return false;
  }
}

// ─── Pull (server → local) ─────────────────────────────────────────

interface ServerDesignMeta {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

interface ServerDesignFull extends ServerDesignMeta {
  document: Record<string, unknown>;
}

/** Pull all designs from the server and merge with local. Returns any conflicts. */
export async function pullAndMerge(): Promise<SyncConflict[]> {
  const conflicts: SyncConflict[] = [];

  try {
    // Get list of server designs
    const res = await fetch(`${API_BASE}/api/designs`, {
      credentials: 'include',
    });
    if (!res.ok) return [];

    const serverList: ServerDesignMeta[] = await res.json();
    const localDesigns = await getAllDesigns();
    const localMap = new Map(localDesigns.map((d) => [d.id, d]));

    for (const serverMeta of serverList) {
      const local = localMap.get(serverMeta.id);

      if (!local) {
        // Server has a design we don't have locally — pull it
        const full = await fetchFullDesign(serverMeta.id);
        if (full) {
          await saveDesign({
            id: full.id,
            name: full.name,
            thumbnail: full.thumbnail,
            createdAt: full.createdAt,
            updatedAt: full.updatedAt,
            document: full.document as unknown as SavedDesign['document'],
          });
        }
      } else {
        // Both have it — compare timestamps
        const localTime = new Date(local.updatedAt).getTime();
        const serverTime = new Date(serverMeta.updatedAt).getTime();
        const diff = Math.abs(localTime - serverTime);

        if (diff < 5000 && diff > 0) {
          // Within 5 seconds — flag as conflict for user to resolve
          conflicts.push({
            designId: serverMeta.id,
            designName: serverMeta.name,
            localUpdatedAt: local.updatedAt,
            serverUpdatedAt: serverMeta.updatedAt,
          });
        } else if (serverTime > localTime) {
          // Server is newer — pull it
          const full = await fetchFullDesign(serverMeta.id);
          if (full) {
            await saveDesign({
              id: full.id,
              name: full.name,
              thumbnail: full.thumbnail,
              createdAt: full.createdAt,
              updatedAt: full.updatedAt,
              document: full.document as unknown as SavedDesign['document'],
            });
          }
        }
        // If local is newer, we'll push it in pushAllLocal
      }
    }

    return conflicts;
  } catch {
    return []; // Server not reachable
  }
}

/** Push all local designs to the server (for ones the server doesn't have or that are newer locally) */
export async function pushAllLocal(): Promise<void> {
  try {
    const localDesigns = await getAllDesigns();
    for (const design of localDesigns) {
      await pushDesignUpdate(design);
    }
  } catch {
    // Server not reachable
  }
}

/** Resolve a conflict by choosing local or server version */
export async function resolveConflict(
  designId: string,
  choice: 'local' | 'server',
): Promise<void> {
  if (choice === 'server') {
    const full = await fetchFullDesign(designId);
    if (full) {
      await saveDesign({
        id: full.id,
        name: full.name,
        thumbnail: full.thumbnail,
        createdAt: full.createdAt,
        updatedAt: full.updatedAt,
        document: full.document as unknown as SavedDesign['document'],
      });
    }
  } else {
    // Local wins — push to server
    const localDesigns = await getAllDesigns();
    const local = localDesigns.find((d) => d.id === designId);
    if (local) {
      await pushDesignUpdate(local);
    }
  }
}

/** Fetch a full design from the server */
async function fetchFullDesign(id: string): Promise<ServerDesignFull | null> {
  try {
    const res = await fetch(`${API_BASE}/api/designs/${id}`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── Sharing ───────────────────────────────────────────────────────

/** Generate a shareable view-only link for a design */
export function getShareLink(designId: string): string {
  return `${window.location.origin}/view/${designId}`;
}

/** Check if the API server is reachable */
export async function isServerAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { credentials: 'include' });
    return res.ok;
  } catch {
    return false;
  }
}
