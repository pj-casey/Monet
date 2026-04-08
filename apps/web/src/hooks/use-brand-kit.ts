/**
 * useBrandKit — manages the active brand kit and kit list.
 *
 * Loads kits from IndexedDB, tracks which one is active,
 * and provides methods to add/update/delete kits and colors.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  type BrandKit,
  getAllBrandKits,
  saveBrandKit,
  deleteBrandKit,
  getActiveKitId,
  setActiveKitId,
  createEmptyKit,
} from '../lib/brand-kit';

export function useBrandKit() {
  const [kits, setKits] = useState<BrandKit[]>([]);
  const [activeKit, setActiveKit] = useState<BrandKit | null>(null);

  /** Load all kits from IndexedDB */
  const refresh = useCallback(async () => {
    const all = await getAllBrandKits();
    setKits(all);

    const activeId = getActiveKitId();
    const found = all.find((k) => k.id === activeId);
    setActiveKit(found ?? all[0] ?? null);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  /** Select a different kit as active */
  const switchKit = useCallback((id: string) => {
    const kit = kits.find((k) => k.id === id);
    if (kit) {
      setActiveKit(kit);
      setActiveKitId(id);
    }
  }, [kits]);

  /** Create a new empty kit */
  const createKit = useCallback(async (name: string) => {
    const kit = createEmptyKit(name);
    await saveBrandKit(kit);
    setActiveKitId(kit.id);
    await refresh();
    return kit;
  }, [refresh]);

  /** Update the active kit (colors, fonts, logos, name) */
  const updateKit = useCallback(async (updates: Partial<BrandKit>) => {
    if (!activeKit) return;
    const updated = { ...activeKit, ...updates };
    await saveBrandKit(updated);
    setActiveKit(updated);
    setKits((prev) => prev.map((k) => k.id === updated.id ? updated : k));
  }, [activeKit]);

  /** Delete a kit */
  const removeKit = useCallback(async (id: string) => {
    await deleteBrandKit(id);
    await refresh();
  }, [refresh]);

  /** Add a color to the active kit */
  const addColor = useCallback(async (color: string) => {
    if (!activeKit || activeKit.colors.length >= 12) return;
    await updateKit({ colors: [...activeKit.colors, color] });
  }, [activeKit, updateKit]);

  /** Remove a color from the active kit by index */
  const removeColor = useCallback(async (index: number) => {
    if (!activeKit) return;
    const colors = activeKit.colors.filter((_, i) => i !== index);
    await updateKit({ colors });
  }, [activeKit, updateKit]);

  /** Get the active kit's brand colors (for use in color pickers) */
  const brandColors = activeKit?.colors ?? [];

  return {
    kits,
    activeKit,
    brandColors,
    switchKit,
    createKit,
    updateKit,
    removeKit,
    addColor,
    removeColor,
    refresh,
  };
}
