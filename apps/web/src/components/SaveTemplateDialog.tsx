/**
 * SaveTemplateDialog — save the current design as a reusable template.
 *
 * Prompts for name, category, and tags, then saves the current
 * canvas state to IndexedDB as a UserTemplate. The saved template
 * appears in the template browser alongside built-in templates.
 */

import { useState, useCallback } from 'react';
import { engine } from './Canvas';
import { saveUserTemplate } from '../lib/user-templates';
import { FocusTrap } from './A11y';
import { useEscapeClose } from '../hooks/use-escape-close';

const CATEGORY_OPTIONS = [
  'Social Media',
  'Video',
  'Presentation',
  'Print',
  'Marketing',
  'Event',
  'Personal',
  'Other',
];

interface SaveTemplateDialogProps {
  onClose: () => void;
}

export function SaveTemplateDialog({ onClose }: SaveTemplateDialogProps) {
  useEscapeClose(true, onClose);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Social Media');
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      setError('Please enter a template name.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const doc = engine.toJSON(name.trim());
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await saveUserTemplate(name.trim(), category, tags, doc);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template.');
    } finally {
      setSaving(false);
    }
  }, [name, category, tagsInput, onClose]);

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <FocusTrap>
      <div
        className="animate-scale-up mx-4 w-full max-w-md rounded-lg bg-overlay p-7 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Save as template"
      >
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Save as Template
        </h2>

        <p className="mb-3 text-xs text-text-secondary">
          Save this design as a reusable template. It will appear in the template browser.
        </p>

        {/* Name */}
        <label className="mb-1 block text-xs font-medium text-text-secondary">
          Template Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Summer Sale Banner"
          className="mb-3 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
          autoFocus
        />

        {/* Category */}
        <label className="mb-1 block text-xs font-medium text-text-secondary">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-3 w-full rounded-lg border border-border px-3 py-2 text-sm"
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Tags */}
        <label className="mb-1 block text-xs font-medium text-text-secondary">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g., sale, summer, banner"
          className="mb-4 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />

        {error && (
          <p className="mb-3 text-xs text-danger">{error}</p>
        )}

        <div className="flex gap-2">
          <button type="button" onClick={onClose}
            className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-text-secondary hover:bg-canvas">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving || !name.trim()}
            className="flex-1 rounded-lg bg-accent py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </div>
      </FocusTrap>
    </div>
  );
}
