/**
 * TemplateBrowser — a modal for picking a template or creating a blank canvas.
 *
 * This is the entry point for starting a new design. It shows:
 * 1. "Blank Canvas" section — pick a preset size or enter custom dimensions
 * 2. Template categories — grids of pre-made designs organized by type
 *
 * When the user picks a template, it loads onto the canvas via fromJSON().
 * When they pick a blank canvas, we resize the artboard and clear everything.
 */

import { useState, useEffect } from 'react';
import { ARTBOARD_PRESETS } from '@monet/shared';
import type { ArtboardPreset } from '@monet/shared';
import { TEMPLATE_REGISTRY, getTemplateCategories } from '@monet/templates';
import type { Template } from '@monet/templates';
import { engine } from './Canvas';
import { useEditorStore } from '../stores/editor-store';
import { AIGenerateDialog } from './AIGenerateDialog';
import { getAllUserTemplates, deleteUserTemplate, type UserTemplate } from '../lib/user-templates';

interface TemplateBrowserProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Called when the modal should close */
  onClose: () => void;
}

export function TemplateBrowser({ isOpen, onClose }: TemplateBrowserProps) {
  const [activeTab, setActiveTab] = useState<'blank' | 'templates' | 'ai'>('templates');
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>([]);
  const setArtboardDimensions = useEditorStore((s) => s.setArtboardDimensions);
  const categories = getTemplateCategories();

  // Load user templates when the browser opens
  useEffect(() => {
    if (isOpen) {
      getAllUserTemplates().then(setUserTemplates);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  /** User picks a blank canvas with a preset size */
  const handleBlankPreset = (preset: ArtboardPreset) => {
    setArtboardDimensions(preset.width, preset.height);
    engine.fromJSON({
      version: 1, id: '', name: 'Untitled Design',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      dimensions: { width: preset.width, height: preset.height },
      background: { type: 'solid', value: '#ffffff' },
      objects: [], metadata: {},
    });
    onClose();
  };

  /** User picks custom dimensions */
  const handleCustom = () => {
    const w = Math.max(100, Math.min(5000, customWidth));
    const h = Math.max(100, Math.min(5000, customHeight));
    handleBlankPreset({ name: 'Custom', category: 'Custom', width: w, height: h });
  };

  /** User picks a saved user template */
  const handleUserTemplateSelect = (ut: UserTemplate) => {
    setArtboardDimensions(ut.dimensions.width, ut.dimensions.height);
    engine.fromJSON(ut.document);
    onClose();
  };

  /** Delete a user template */
  const handleDeleteUserTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteUserTemplate(id);
    setUserTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  /** User picks a template — load its DesignDocument onto the canvas */
  const handleTemplateSelect = (template: Template) => {
    setArtboardDimensions(template.dimensions.width, template.dimensions.height);
    engine.fromJSON(template.document);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Template browser"
    >
      <div className="flex h-[85vh] w-[90vw] max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 dark:border-gray-700 py-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">New Design</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-gray-200 px-6 dark:border-gray-700">
          <TabButton active={activeTab === 'templates'} onClick={() => setActiveTab('templates')}>
            Templates
          </TabButton>
          <TabButton active={activeTab === 'blank'} onClick={() => setActiveTab('blank')}>
            Blank Canvas
          </TabButton>
          <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>
            Generate with AI
          </TabButton>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'blank' && (
            <BlankCanvasSection
              onPresetSelect={handleBlankPreset}
              customWidth={customWidth}
              customHeight={customHeight}
              onCustomWidthChange={setCustomWidth}
              onCustomHeightChange={setCustomHeight}
              onCustomCreate={handleCustom}
            />
          )}

          {activeTab === 'templates' && (
            <>
              {/* User-saved templates */}
              {userTemplates.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    My Templates
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {userTemplates.map((ut) => (
                      <div key={ut.id} className="group relative">
                        <button type="button" onClick={() => handleUserTemplateSelect(ut)}
                          className="w-full overflow-hidden rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:hover:border-blue-500">
                          <div className="flex h-24 items-center justify-center text-xs text-gray-400"
                            style={{ backgroundColor: ut.document.background?.value || '#f3f4f6' }}>
                            {ut.dimensions.width} &times; {ut.dimensions.height}
                          </div>
                          <div className="px-2 py-1.5">
                            <p className="truncate text-xs font-medium text-gray-700 dark:text-gray-200">{ut.name}</p>
                            <p className="truncate text-[10px] text-gray-400">{ut.category}</p>
                          </div>
                        </button>
                        <button type="button" onClick={(e) => handleDeleteUserTemplate(ut.id, e)}
                          className="absolute right-1 top-1 hidden rounded bg-red-500 px-1.5 py-0.5 text-[9px] text-white group-hover:block"
                          title="Delete template">
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Built-in templates */}
              <TemplatesSection
                categories={categories}
                onTemplateSelect={handleTemplateSelect}
              />
            </>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Describe the design you want and AI will create it for you.
              </p>
              <button
                type="button"
                onClick={() => setShowAIDialog(true)}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-blue-700"
              >
                Open AI Generator
              </button>
            </div>
          )}
        </div>

        {/* AI Generate Dialog (rendered as overlay above the template browser) */}
        {showAIDialog && (
          <AIGenerateDialog onClose={() => { setShowAIDialog(false); onClose(); }} />
        )}
      </div>
    </div>
  );
}

// ─── Blank Canvas Section ──────────────────────────────────────────

function BlankCanvasSection({
  onPresetSelect, customWidth, customHeight,
  onCustomWidthChange, onCustomHeightChange, onCustomCreate,
}: {
  onPresetSelect: (preset: ArtboardPreset) => void;
  customWidth: number; customHeight: number;
  onCustomWidthChange: (w: number) => void;
  onCustomHeightChange: (h: number) => void;
  onCustomCreate: () => void;
}) {
  // Group presets by category
  const presetsByCategory: Record<string, ArtboardPreset[]> = {};
  for (const p of ARTBOARD_PRESETS) {
    if (p.category === 'Custom') continue;
    if (!presetsByCategory[p.category]) presetsByCategory[p.category] = [];
    presetsByCategory[p.category].push(p);
  }

  return (
    <div>
      {/* Custom dimensions */}
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-semibold text-gray-600">Custom Size</h3>
        <div className="flex items-end gap-3">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Width (px)</label>
            <input
              type="number" min={100} max={5000} value={customWidth}
              onChange={(e) => onCustomWidthChange(Number(e.target.value))}
              className="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          </div>
          <span className="pb-2 text-gray-400">×</span>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Height (px)</label>
            <input
              type="number" min={100} max={5000} value={customHeight}
              onChange={(e) => onCustomHeightChange(Number(e.target.value))}
              className="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          </div>
          <button type="button" onClick={onCustomCreate}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
            Create
          </button>
        </div>
      </div>

      {/* Preset categories */}
      {Object.entries(presetsByCategory).map(([category, presets]) => (
        <div key={category} className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-600">{category}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onPresetSelect(preset)}
                className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 text-center hover:border-blue-400 hover:bg-blue-50"
              >
                {/* Mini preview showing aspect ratio */}
                <PresetPreview width={preset.width} height={preset.height} />
                <span className="text-xs font-medium text-gray-700">{preset.name}</span>
                <span className="text-[10px] text-gray-400">
                  {preset.width} × {preset.height}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Shows a small rectangle with correct aspect ratio to preview the format */
function PresetPreview({ width, height }: { width: number; height: number }) {
  const maxDim = 48;
  const aspect = width / height;
  const w = aspect >= 1 ? maxDim : maxDim * aspect;
  const h = aspect >= 1 ? maxDim / aspect : maxDim;

  return (
    <div
      className="rounded border border-gray-300 bg-white"
      style={{ width: `${w}px`, height: `${h}px` }}
    />
  );
}

// ─── Templates Section ─────────────────────────────────────────────

function TemplatesSection({
  categories, onTemplateSelect,
}: {
  categories: string[];
  onTemplateSelect: (template: Template) => void;
}) {
  return (
    <div>
      {categories.map((category) => {
        const templates = TEMPLATE_REGISTRY.filter((t) => t.category === category);
        return (
          <div key={category} className="mb-8">
            <h3 className="mb-3 text-sm font-semibold text-gray-600">{category}</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {templates.map((template) => (
                <TemplateCard
                  key={template.templateId}
                  template={template}
                  onSelect={() => onTemplateSelect(template)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TemplateCard({ template, onSelect }: { template: Template; onSelect: () => void }) {
  // Determine background color from the template for the preview card
  const bgColor = template.document.background.type === 'solid'
    ? template.document.background.value
    : '#f3f4f6';

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 text-left hover:border-blue-400 hover:shadow-md"
    >
      {/* Color preview area */}
      <div
        className="flex h-32 items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-xs font-medium text-white/80 drop-shadow">
          {template.dimensions.width} × {template.dimensions.height}
        </span>
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
          {template.name}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">
          {template.subcategory || template.category}
        </p>
      </div>
    </button>
  );
}

// ─── Tab Button ────────────────────────────────────────────────────

function TabButton({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-4 py-2 text-sm font-medium ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
}
