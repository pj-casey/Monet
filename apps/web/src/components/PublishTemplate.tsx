/**
 * PublishTemplate — dialog for publishing the current design as a community template.
 *
 * User fills in: name, description, category, tags.
 * Design document + thumbnail are sent to the API.
 * Templates go into a moderation queue before appearing publicly.
 */

import { useState } from 'react';
import { engine } from './Canvas';
import { useEditorStore } from '../stores/editor-store';
import { FocusTrap } from './A11y';
import { useEscapeClose } from '../hooks/use-escape-close';

const API_BASE = 'http://localhost:3001';

const CATEGORIES = ['Social Media', 'Video', 'Presentation', 'Print', 'Marketing', 'Other'];

interface PublishTemplateProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PublishTemplate({ isOpen, onClose }: PublishTemplateProps) {
  useEscapeClose(isOpen, onClose);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Social Media');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'publishing' | 'done' | 'error'>('idle');
  const artboardWidth = useEditorStore((s) => s.artboardWidth);
  const artboardHeight = useEditorStore((s) => s.artboardHeight);

  if (!isOpen) return null;

  const handlePublish = async () => {
    if (!name.trim()) return;
    setStatus('publishing');

    try {
      const doc = engine.toJSON(name);
      const thumbnail = engine.getArtboardDataURL(0.2);
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

      const res = await fetch(`${API_BASE}/api/marketplace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          category,
          tags,
          dimensions: { width: artboardWidth, height: artboardHeight },
          document: doc,
          thumbnail,
        }),
      });

      if (res.ok) {
        setStatus('done');
        setTimeout(() => { onClose(); setStatus('idle'); setName(''); setDescription(''); }, 2000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to publish');
        setStatus('error');
      }
    } catch {
      alert('Cannot connect to server. Is the API running?');
      setStatus('error');
    }
  };

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true">
      <FocusTrap>
      <div className="w-full max-w-md animate-scale-up rounded-lg bg-overlay p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Publish as Template</h2>

        {status === 'done' ? (
          <div className="py-8 text-center">
            <p className="text-lg text-success">Submitted for review!</p>
            <p className="mt-1 text-xs text-text-tertiary">Your template will appear once approved.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="My Template"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your template..."
                  rows={3}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">Tags (comma-separated)</label>
                <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="instagram, bold, modern"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
              </div>
              <p className="text-[10px] text-text-tertiary">
                {artboardWidth} × {artboardHeight} px — Template will be reviewed before publishing.
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button type="button" onClick={onClose}
                className="flex-1 rounded-lg border border-border-strong px-4 py-2 text-sm text-text-secondary hover:bg-canvas">
                Cancel
              </button>
              <button type="button" onClick={handlePublish} disabled={!name.trim() || status === 'publishing'}
                className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-50">
                {status === 'publishing' ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </>
        )}
      </div>
      </FocusTrap>
    </div>
  );
}
