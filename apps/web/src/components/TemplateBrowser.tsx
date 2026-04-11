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

import { useState, useEffect, useCallback } from 'react';
import { ARTBOARD_PRESETS } from '@monet/shared';
import { FocusTrap } from './A11y';
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
  /** Which tab to show first when opening */
  initialTab?: 'templates' | 'blank' | 'ai';
}

export function TemplateBrowser({ isOpen, onClose, initialTab }: TemplateBrowserProps) {
  const [activeTab, setActiveTab] = useState<'blank' | 'templates' | 'ai'>('templates');

  // Sync to initialTab when the modal opens
  useEffect(() => {
    if (isOpen && initialTab) setActiveTab(initialTab);
  }, [isOpen, initialTab]);
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
  const handleTemplateSelect = useCallback((template: Template) => {
    setArtboardDimensions(template.dimensions.width, template.dimensions.height);
    engine.fromJSON(template.document);
    addRecentTemplate(template.name);
    onClose();
  }, [setArtboardDimensions, onClose]);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Template browser"
    >
      <FocusTrap>
      <div className="animate-scale-up flex h-[85vh] w-[90vw] max-w-5xl flex-col overflow-hidden rounded-lg bg-overlay shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-text-primary">New Design</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary hover:bg-wash hover:text-text-secondary"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-border px-6">
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
                  <h3 className="mb-3 text-sm font-semibold text-text-primary">
                    My Templates
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {userTemplates.map((ut) => (
                      <div key={ut.id} className="group relative">
                        <button type="button" onClick={() => handleUserTemplateSelect(ut)}
                          className="w-full overflow-hidden rounded-lg border border-border hover:border-accent hover:shadow-md">
                          <div className="flex h-24 items-center justify-center text-xs text-text-tertiary"
                            style={{ backgroundColor: ut.document.background?.value || '#f5f0eb' }}>
                            {ut.dimensions.width} &times; {ut.dimensions.height}
                          </div>
                          <div className="px-2 py-1.5">
                            <p className="truncate text-xs font-medium text-text-primary">{ut.name}</p>
                            <p className="truncate text-[10px] text-text-tertiary">{ut.category}</p>
                          </div>
                        </button>
                        <button type="button" onClick={(e) => handleDeleteUserTemplate(ut.id, e)}
                          className="absolute right-1 top-1 hidden rounded bg-danger-subtle0 px-1.5 py-0.5 text-[9px] text-accent-fg group-hover:block"
                          title="Delete template">
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently used templates */}
              {(() => {
                const recentNames = getRecentTemplates();
                const recentTemplates = recentNames
                  .map((name) => TEMPLATE_REGISTRY.find((t) => t.name === name))
                  .filter((t): t is Template => !!t);
                if (recentTemplates.length === 0) return null;
                return (
                  <div className="mb-6">
                    <h3 className="mb-3 text-sm font-semibold text-text-primary">Recent</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {recentTemplates.map((t) => (
                        <button key={t.name} type="button" onClick={() => handleTemplateSelect(t)}
                          className="overflow-hidden rounded-lg border border-border text-left hover:border-accent hover:shadow-md">
                          <div className="flex h-24 items-center justify-center text-xs text-text-tertiary"
                            style={{ backgroundColor: t.document.background?.value || '#f5f0eb' }}>
                            {t.dimensions.width} &times; {t.dimensions.height}
                          </div>
                          <div className="px-2 py-1.5">
                            <p className="truncate text-xs font-medium text-text-primary">{t.name}</p>
                            <p className="truncate text-[10px] text-text-tertiary">{t.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Built-in templates */}
              <TemplatesSection
                categories={categories}
                onTemplateSelect={handleTemplateSelect}
              />
            </>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="mb-4 text-center text-sm text-text-secondary">
                Describe the design you want and AI will create it for you.
              </p>
              <button
                type="button"
                onClick={() => setShowAIDialog(true)}
                className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-fg shadow hover:bg-accent-hover"
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
      </FocusTrap>
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
        <h3 className="mb-3 text-sm font-semibold text-text-secondary">Custom Size</h3>
        <div className="flex items-end gap-3">
          <div>
            <label className="mb-1 block text-xs text-text-tertiary">Width (px)</label>
            <input
              type="number" min={100} max={5000} value={customWidth}
              onChange={(e) => onCustomWidthChange(Number(e.target.value))}
              className="w-24 rounded border border-border-strong px-2 py-1.5 text-sm"
            />
          </div>
          <span className="pb-2 text-text-tertiary">×</span>
          <div>
            <label className="mb-1 block text-xs text-text-tertiary">Height (px)</label>
            <input
              type="number" min={100} max={5000} value={customHeight}
              onChange={(e) => onCustomHeightChange(Number(e.target.value))}
              className="w-24 rounded border border-border-strong px-2 py-1.5 text-sm"
            />
          </div>
          <button type="button" onClick={onCustomCreate}
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-accent-fg hover:bg-accent-hover">
            Create
          </button>
        </div>
      </div>

      {/* Preset categories */}
      {Object.entries(presetsByCategory).map(([category, presets]) => (
        <div key={category} className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-text-secondary">{category}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onPresetSelect(preset)}
                className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center hover:border-accent hover:bg-accent-subtle"
              >
                {/* Mini preview showing aspect ratio */}
                <PresetPreview width={preset.width} height={preset.height} />
                <span className="text-xs font-medium text-text-primary">{preset.name}</span>
                <span className="text-[10px] text-text-tertiary">
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
      className="rounded border border-border-strong bg-surface"
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
            <h3 className="mb-3 text-sm font-semibold text-text-secondary">{category}</h3>
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
    : '#f5f0eb';

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col overflow-hidden rounded-lg border border-border text-left hover:border-accent hover:shadow-md"
    >
      {/* Color preview area */}
      <div
        className="flex h-32 items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-xs font-medium text-accent-fg/80 drop-shadow">
          {template.dimensions.width} × {template.dimensions.height}
        </span>
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-text-primary group-hover:text-accent">
          {template.name}
        </p>
        <p className="mt-0.5 text-xs text-text-tertiary">
          {template.subcategory || template.category}
        </p>
      </div>
    </button>
  );
}

// ─── Tab Button ────────────────────────────────────────────────────

// ─── Recently Used Templates ──────────────────────────────────────

const RECENT_TEMPLATES_KEY = 'monet-recent-templates';
const MAX_RECENT_TEMPLATES = 5;

function getRecentTemplates(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function addRecentTemplate(name: string): void {
  const recent = getRecentTemplates().filter((n) => n !== name);
  recent.unshift(name);
  if (recent.length > MAX_RECENT_TEMPLATES) recent.pop();
  localStorage.setItem(RECENT_TEMPLATES_KEY, JSON.stringify(recent));
}

// ─── Sub-components ───────────────────────────────────────────────

function TabButton({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-4 py-2 text-sm font-medium ${
        active
          ? 'border-accent text-accent'
          : 'border-transparent text-text-secondary hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
}
