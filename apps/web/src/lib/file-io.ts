/**
 * File I/O — export and import .monet files.
 *
 * A .monet file is just a JSON file containing a DesignDocument.
 * It can be shared between machines by downloading and uploading.
 */

import type { DesignDocument } from '@monet/shared';

/**
 * Download a DesignDocument as a .monet file.
 * Triggers a browser save dialog.
 */
export function exportDesignFile(doc: DesignDocument, filename?: string): void {
  const name = filename || doc.name || 'design';
  const json = JSON.stringify(doc, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.monet`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Open a file picker and import a .monet file.
 * Returns the parsed DesignDocument, or null if cancelled.
 */
export function importDesignFile(): Promise<DesignDocument | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.monet,application/json';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) { resolve(null); return; }

      try {
        const text = await file.text();
        const doc = JSON.parse(text) as DesignDocument;
        // Validate required fields exist and the design has content
        if (!doc.version || !doc.dimensions) {
          throw new Error('Invalid file format: missing version or dimensions');
        }
        const hasObjects = Array.isArray(doc.objects) && doc.objects.length > 0;
        const hasPages = Array.isArray(doc.pages) && doc.pages.length > 0;
        if (!hasObjects && !hasPages) {
          throw new Error('Invalid file format: no design content found');
        }
        resolve(doc);
      } catch {
        alert('Could not open this file. Make sure it is a valid .monet file.');
        resolve(null);
      }
    };

    input.oncancel = () => resolve(null);
    input.click();
  });
}
