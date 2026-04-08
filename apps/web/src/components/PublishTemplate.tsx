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

const API_BASE = 'http://localhost:3001';

const CATEGORIES = ['Social Media', 'Video', 'Presentation', 'Print', 'Marketing', 'Other'];

interface PublishTemplateProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PublishTemplate({ isOpen, onClose }: PublishTemplateProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Publish as Template</h2>

        {status === 'done' ? (
          <div className="py-8 text-center">
            <p className="text-lg text-green-600">Submitted for review!</p>
            <p className="mt-1 text-xs text-gray-400">Your template will appear once approved.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome Template"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your template..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Tags (comma-separated)</label>
                <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="instagram, bold, modern"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" />
              </div>
              <p className="text-[10px] text-gray-400">
                {artboardWidth} × {artboardHeight} px — Template will be reviewed before publishing.
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button type="button" onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button type="button" onClick={handlePublish} disabled={!name.trim() || status === 'publishing'}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {status === 'publishing' ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
