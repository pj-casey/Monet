/**
 * Storage Migration — migrates data from old "opencanvas-*" storage keys
 * to new "monet-*" keys so existing users don't lose their designs.
 *
 * Runs once on app startup. Checks for old keys, copies to new keys,
 * then removes the old ones. Safe to run multiple times (idempotent).
 */

/** Migrate a localStorage key from old to new name */
function migrateLocalStorageKey(oldKey: string, newKey: string): void {
  try {
    const value = localStorage.getItem(oldKey);
    if (value !== null && localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, value);
      localStorage.removeItem(oldKey);
    }
  } catch {
    // localStorage may be unavailable
  }
}

/** Migrate an IndexedDB database from old to new name */
async function migrateIndexedDB(oldName: string, newName: string, storeName: string): Promise<void> {
  // Check if old DB exists by trying to open it
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(oldName);
      req.onsuccess = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.close();
          resolve();
          return;
        }

        // Read all data from old DB
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const getAll = store.getAll();

        getAll.onsuccess = () => {
          const records = getAll.result;
          db.close();

          if (records.length === 0) {
            resolve();
            return;
          }

          // Write to new DB
          const newReq = indexedDB.open(newName, 1);
          newReq.onupgradeneeded = () => {
            const newDb = newReq.result;
            if (!newDb.objectStoreNames.contains(storeName)) {
              newDb.createObjectStore(storeName, { keyPath: 'id' });
            }
          };
          newReq.onsuccess = () => {
            const newDb = newReq.result;
            if (!newDb.objectStoreNames.contains(storeName)) {
              newDb.close();
              resolve();
              return;
            }
            const newTx = newDb.transaction(storeName, 'readwrite');
            const newStore = newTx.objectStore(storeName);
            for (const record of records) {
              newStore.put(record);
            }
            newTx.oncomplete = () => {
              newDb.close();
              // Delete old database
              indexedDB.deleteDatabase(oldName);
              resolve();
            };
            newTx.onerror = () => { newDb.close(); resolve(); };
          };
          newReq.onerror = () => resolve();
        };
        getAll.onerror = () => { db.close(); resolve(); };
      };
      req.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Run all migrations. Call once at app startup.
 * Safe to call multiple times — only migrates if old data exists
 * and new data doesn't.
 */
export async function migrateFromOpenCanvas(): Promise<void> {
  // localStorage keys
  migrateLocalStorageKey('opencanvas-current-design-id', 'monet-current-design-id');
  migrateLocalStorageKey('opencanvas-theme', 'monet-theme');
  migrateLocalStorageKey('opencanvas-onboarding-done', 'monet-onboarding-done');
  migrateLocalStorageKey('opencanvas-lang', 'monet-lang');
  migrateLocalStorageKey('opencanvas-active-brand-kit-id', 'monet-active-brand-kit-id');
  migrateLocalStorageKey('opencanvas-anthropic-key', 'monet-anthropic-key');

  // IndexedDB databases
  await migrateIndexedDB('opencanvas-db', 'monet-db', 'designs');
  await migrateIndexedDB('opencanvas-brands', 'monet-brands', 'brand-kits');
  await migrateIndexedDB('opencanvas-user-templates', 'monet-user-templates', 'templates');
}
