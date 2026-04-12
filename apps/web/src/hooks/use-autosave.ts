/**
 * useAutosave — auto-saves the current design to IndexedDB + optional server sync.
 *
 * How it works:
 * 1. After every meaningful change, a 2-second debounce timer starts
 * 2. When the timer fires, the design is saved to IndexedDB
 * 3. If the user is logged in, the design is also pushed to the server
 * 4. If the user leaves the page (blur/beforeunload), save immediately
 * 5. Status is tracked: 'saved' | 'saving' | 'unsaved' | 'syncing'
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { engine } from '../components/Canvas';
import { saveDesign, setCurrentDesignId, type SavedDesign } from '../lib/db';
import { pushDesignUpdate } from '../lib/sync';
import { useEditorStore } from '../stores/editor-store';

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'syncing';

const DEBOUNCE_MS = 2000;

export function useAutosave(isLoggedIn: boolean = false) {
  const [status, setStatus] = useState<SaveStatus>('saved');
  const [currentId, setCurrentId] = useState<string>('');
  const [designName, setDesignName] = useState('Untitled Design');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(false);
  const savingRef = useRef(false);

  const artboardWidth = useEditorStore((s) => s.artboardWidth);
  const artboardHeight = useEditorStore((s) => s.artboardHeight);

  /** Generate a thumbnail from the current canvas state */
  const generateThumbnail = useCallback((): string => {
    const fabricCanvas = engine.getFabricCanvas();
    if (!fabricCanvas) return '';
    try {
      const vpt = [...fabricCanvas.viewportTransform];
      fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = fabricCanvas.toDataURL({
        format: 'png',
        quality: 0.3,
        multiplier: 0.15,
        left: 0,
        top: 0,
        width: artboardWidth,
        height: artboardHeight,
      });
      fabricCanvas.setViewportTransform(vpt as typeof fabricCanvas.viewportTransform);
      return dataUrl;
    } catch {
      return '';
    }
  }, [artboardWidth, artboardHeight]);

  /** Perform the actual save to IndexedDB + optional server push */
  const doSave = useCallback(async () => {
    if (!engine.isInitialized()) return;
    if (savingRef.current) return; // Prevent concurrent saves
    savingRef.current = true;

    try {
      setStatus('saving');

      const doc = engine.toJSON(designName, currentId || undefined);
      const id = currentId || doc.id;
      if (!currentId) setCurrentId(id);
      doc.id = id;

      const thumbnail = generateThumbnail();

      const record: SavedDesign = {
        id,
        name: designName,
        updatedAt: doc.updatedAt,
        createdAt: doc.createdAt || new Date().toISOString(),
        thumbnail,
        document: doc,
      };

      // Save to IndexedDB (always)
      await saveDesign(record);
      setCurrentDesignId(id);
      dirtyRef.current = false;

      // Push to server if logged in
      if (isLoggedIn) {
        setStatus('syncing');
        await pushDesignUpdate(record);
      }

      setStatus('saved');
    } finally {
      savingRef.current = false;
      // If changes were made during save, re-trigger after debounce
      if (dirtyRef.current) {
        timerRef.current = setTimeout(() => { doSave(); }, DEBOUNCE_MS);
      }
    }
  }, [currentId, designName, generateThumbnail, isLoggedIn]);

  /** Mark the design as having unsaved changes and start debounce timer */
  const markDirty = useCallback(() => {
    dirtyRef.current = true;
    setStatus('unsaved');

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      doSave();
    }, DEBOUNCE_MS);
  }, [doSave]);

  /** Save immediately (for Ctrl+S or before-unload) */
  const saveNow = useCallback(() => {
    if (!dirtyRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    doSave();
  }, [doSave]);

  /** Load a design into the editor.
   * Note: does NOT call engine.fromJSON() — the caller (App.tsx) uses the
   * pendingDoc pattern to defer loading until the Canvas component has mounted
   * and the engine is initialized. */
  const loadDesign = useCallback((saved: SavedDesign) => {
    setCurrentId(saved.id);
    setDesignName(saved.name);
    setCurrentDesignId(saved.id);
    setStatus('saved');
    dirtyRef.current = false;
  }, []);

  /** Start a fresh new design */
  const newDesign = useCallback(() => {
    // Generate a new ID immediately so auto-save doesn't reuse the old one
    const newId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    setCurrentId(newId);
    setDesignName('Untitled Design');
    setCurrentDesignId(newId);
    setStatus('saved');
    dirtyRef.current = false;
  }, []);

  // Listen for canvas changes to trigger auto-save
  useEffect(() => {
    const fabricCanvas = engine.getFabricCanvas();
    if (!fabricCanvas) return;

    const onChange = () => markDirty();
    fabricCanvas.on('object:modified', onChange);
    fabricCanvas.on('object:added', onChange);
    fabricCanvas.on('object:removed', onChange);
    fabricCanvas.on('path:created', onChange);

    return () => {
      fabricCanvas.off('object:modified', onChange);
      fabricCanvas.off('object:added', onChange);
      fabricCanvas.off('object:removed', onChange);
      fabricCanvas.off('path:created', onChange);
    };
  }, [markDirty]);

  // Save on blur and beforeunload
  useEffect(() => {
    const onBlur = () => { if (dirtyRef.current) doSave(); };
    const onBeforeUnload = () => { if (dirtyRef.current) doSave(); };

    window.addEventListener('blur', onBlur);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [doSave]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return {
    status,
    currentId,
    designName,
    setDesignName,
    markDirty,
    saveNow,
    loadDesign,
    newDesign,
    setCurrentId,
  };
}
