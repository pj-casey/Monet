/**
 * History — undo/redo system using the command pattern.
 *
 * Every time the user makes a change (move an object, change a color, etc.),
 * we save a "snapshot" of the entire canvas state. This snapshot is wrapped
 * in a Command object.
 *
 * - Undo: go back to the previous snapshot
 * - Redo: go forward to the next snapshot (only available after an undo)
 *
 * The "command pattern" is a design pattern where each action is an object
 * that knows how to execute and undo itself. Here, our commands are
 * snapshot-based: "before" state and "after" state.
 *
 * Why snapshots instead of individual operation tracking?
 * - Works reliably with ALL Fabric.js operations automatically
 * - No risk of missing an operation type
 * - Simple to reason about
 * - Memory cost is acceptable for typical designs
 */

import { Canvas as FabricCanvas, type FabricObject, util } from 'fabric';
import { isInfrastructure } from './tagged-object';

/** Maximum number of undo steps to keep in memory */
const MAX_HISTORY_SIZE = 50;

/** A command represents a single undoable action */
interface Command {
  /** Human-readable description (e.g., "Move rectangle") */
  description: string;
  /** Canvas state BEFORE this action */
  beforeState: string;
  /** Canvas state AFTER this action */
  afterState: string;
}

/**
 * HistoryManager — manages the undo/redo stacks.
 *
 * Think of it like two stacks of papers:
 * - The "undo stack" holds all past states (what you've done)
 * - The "redo stack" holds states you've undone (available to redo)
 *
 * When you make a new change, the redo stack is cleared
 * (you can't redo after making a new change).
 */
export class HistoryManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private canvas: FabricCanvas | null = null;
  private pendingState: string | null = null;
  private isRestoring = false;
  private onChange?: (canUndo: boolean, canRedo: boolean) => void;

  /**
   * Connect the history manager to a Fabric.js canvas.
   *
   * @param canvas - The Fabric.js canvas to track
   * @param onChange - Called whenever undo/redo availability changes
   */
  init(canvas: FabricCanvas, onChange?: (canUndo: boolean, canRedo: boolean) => void): void {
    this.canvas = canvas;
    this.onChange = onChange;
    this.undoStack = [];
    this.redoStack = [];
    this.isRestoring = false;

    // Save the initial state as a baseline
    this.pendingState = this.serializeCanvas();
  }

  /**
   * Call this BEFORE an action happens to capture the "before" state.
   * The canvas-engine calls this before any operation that modifies objects.
   */
  saveCheckpoint(): void {
    if (!this.canvas || this.isRestoring) return;
    this.pendingState = this.serializeCanvas();
  }

  /**
   * Call this AFTER an action to record the change as a command.
   *
   * @param description - What the action was (e.g., "Move object")
   */
  commit(description: string): void {
    if (!this.canvas || this.isRestoring || !this.pendingState) return;

    const afterState = this.serializeCanvas();

    // Don't record if nothing actually changed
    if (this.pendingState === afterState) return;

    const command: Command = {
      description,
      beforeState: this.pendingState,
      afterState,
    };

    this.undoStack.push(command);

    // Limit stack size to prevent excessive memory usage
    if (this.undoStack.length > MAX_HISTORY_SIZE) {
      this.undoStack.shift();
    }

    // Making a new change clears the redo stack
    this.redoStack = [];
    this.pendingState = afterState;

    this.notifyChange();
  }

  /**
   * Undo the last action — restores the canvas to its previous state.
   */
  undo(): void {
    if (!this.canvas || this.undoStack.length === 0 || this.isRestoring) return;

    const command = this.undoStack.pop()!;
    this.redoStack.push(command);

    this.restoreState(command.beforeState);
    this.pendingState = command.beforeState;

    this.notifyChange();
  }

  /**
   * Redo a previously undone action — restores the canvas to its "after" state.
   */
  redo(): void {
    if (!this.canvas || this.redoStack.length === 0 || this.isRestoring) return;

    const command = this.redoStack.pop()!;
    this.undoStack.push(command);

    this.restoreState(command.afterState);
    this.pendingState = command.afterState;

    this.notifyChange();
  }

  /** Whether there are any actions to undo */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /** Whether there are any actions to redo */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /** Clear all history */
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.pendingState = this.canvas ? this.serializeCanvas() : null;
    this.notifyChange();
  }

  /** Clean up */
  dispose(): void {
    this.canvas = null;
    this.undoStack = [];
    this.redoStack = [];
    this.pendingState = null;
  }

  /**
   * Serialize the current canvas state to a JSON string.
   * This captures all objects, their positions, colors, etc.
   */
  private serializeCanvas(): string {
    if (!this.canvas) return '{}';
    // Filter out infrastructure objects (grid lines, guides, artboard bg, pen preview, crop overlay)
    const objects = this.canvas.getObjects().filter(
      (obj) => !isInfrastructure(obj),
    );
    return JSON.stringify(objects.map((obj) => obj.toObject()));
  }

  /**
   * Restore the canvas to a previously saved state.
   */
  private async restoreState(stateJson: string): Promise<void> {
    if (!this.canvas) return;

    this.isRestoring = true;

    // Remove all user objects (keep infrastructure: grid, guides, artboard, bg image, pen preview, crop overlay)
    const toRemove = this.canvas.getObjects().filter(
      (obj) => !isInfrastructure(obj),
    );
    for (const obj of toRemove) {
      this.canvas.remove(obj);
    }

    // Restore objects from the saved state
    const objectsData = JSON.parse(stateJson) as Record<string, unknown>[];
    if (objectsData.length > 0) {
      // Use Fabric's enlivening to recreate objects from their serialized form
      const enlivenedItems = await util.enlivenObjects(objectsData);
      for (let i = 0; i < enlivenedItems.length; i++) {
        const item = enlivenedItems[i];
        // enlivenObjects can return various types; we only want FabricObjects
        if (item && typeof (item as FabricObject).set === 'function') {
          const obj = item as FabricObject;
          // Re-apply custom properties that Fabric.js doesn't restore automatically
          const data = objectsData[i];
          if (data.__isFreehandStroke) {
            (obj as any).__isFreehandStroke = true;
            (obj as any).erasable = true;
          }
          if (data.__isMonochromeIcon) {
            (obj as any).__isMonochromeIcon = true;
          }
          this.canvas?.add(obj);
        }
      }
    }
    this.canvas?.requestRenderAll();
    this.isRestoring = false;
  }

  /** Notify the UI that undo/redo availability changed */
  private notifyChange(): void {
    this.onChange?.(this.canUndo(), this.canRedo());
  }
}

