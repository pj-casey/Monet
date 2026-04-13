/**
 * LandingPage — the "/" route for Monet.
 *
 * Optimized for HN launch: specific hero copy, show-don't-tell features,
 * honest comparison, self-hosting, open source credibility.
 * Uses DESIGN.md tokens exclusively. Fraunces for headings, DM Sans for body.
 * Intersection Observer drives subtle fade-in on scroll.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TEMPLATE_REGISTRY } from '@monet/templates';
import { renderTemplateThumbnail } from '@monet/canvas-engine';
import {
  Check, X, Terminal, Heart, ArrowRight, Sun, Moon, Users,
} from 'lucide-react';

/** Inline GitHub mark SVG — lucide doesn't include brand logos */
function GithubIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
import { useTheme } from '../hooks/use-theme';

/* ═══════════════════════════════════════════════════════════════════ */
/* Intersection Observer hook — fade-in on scroll                     */
/* ═══════════════════════════════════════════════════════════════════ */

function useReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 500ms var(--ease-out), transform 500ms var(--ease-out)';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Smooth scroll helper                                               */
/* ═══════════════════════════════════════════════════════════════════ */

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Comparison table data                                              */
/* ═══════════════════════════════════════════════════════════════════ */

type CellValue = true | false | string;

interface CompRow {
  label: string;
  monet: CellValue;
  canvaFree: CellValue;
  canvaPro: CellValue;
}

const COMPARISON: CompRow[] = [
  { label: 'Price',              monet: 'Free forever', canvaFree: '$0',        canvaPro: '$15/mo' },
  { label: 'Account Required',   monet: false,          canvaFree: true,        canvaPro: true },
  { label: 'Open Source',        monet: true,           canvaFree: false,       canvaPro: false },
  { label: 'Self-Hostable',     monet: true,           canvaFree: false,       canvaPro: false },
  { label: 'AI Design Generation', monet: true,        canvaFree: false,       canvaPro: true },
  { label: 'Background Removal', monet: true,          canvaFree: false,       canvaPro: true },
  { label: 'Brand Kit',         monet: true,           canvaFree: false,       canvaPro: true },
  { label: 'Export (PNG/PDF/SVG)', monet: true,        canvaFree: 'Limited',   canvaPro: true },
  { label: 'Watermarks',        monet: 'None',         canvaFree: 'On premium', canvaPro: 'None' },
];

function CellDisplay({ value, label }: { value: CellValue; label: string }) {
  if (value === true) return <span role="img" aria-label={`${label}: Yes`}><Check size={18} className="mx-auto text-accent" strokeWidth={2.5} aria-hidden="true" /></span>;
  if (value === false) return <span role="img" aria-label={`${label}: No`}><X size={18} className="mx-auto text-text-tertiary" strokeWidth={2} aria-hidden="true" /></span>;
  return <span>{value}</span>;
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Landing Page Component                                             */
/* ═══════════════════════════════════════════════════════════════════ */

export function LandingPage() {
  const { isDark, toggleTheme } = useTheme();

  const heroRef = useReveal();
  const featuresRef = useReveal();
  const comparisonRef = useReveal();
  const selfHostRef = useReveal();
  const openSourceRef = useReveal();
  const supportRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div className="min-h-screen bg-surface font-sans text-text-primary">

      {/* Skip to content — keyboard accessibility */}
      <button type="button" onClick={() => scrollTo('main-content')} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg focus:shadow-lg">
        Skip to content
      </button>

      {/* ─── Nav ─────────────────────────────────────────────── */}
      <nav aria-label="Main navigation" className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-text-primary">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width="22" height="22" className="block" aria-hidden="true" />
            Monet
          </span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => scrollTo('features')}
              className="hidden text-sm font-medium text-text-secondary hover:text-text-primary sm:block"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollTo('self-host')}
              className="hidden text-sm font-medium text-text-secondary hover:text-text-primary sm:block"
            >
              Self-Host
            </button>
            <a
              href="https://github.com/pj-casey/Monet"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary sm:flex"
            >
              <GithubIcon size={14} />
              GitHub
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-sm text-text-secondary hover:bg-wash hover:text-text-primary"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link
              to="/editor"
              className="rounded-sm bg-accent px-4 py-1.5 text-sm font-medium text-accent-fg hover:bg-accent-hover"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────── */}
      <main id="main-content">
      <section
        ref={heroRef as React.RefObject<HTMLElement>}
        className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center sm:pb-28 sm:pt-24"
      >
        <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl">
          Design anything.{' '}
          <br className="hidden sm:block" />
          Free forever.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
          Open-source graphic design for social posts, presentations, and
          marketing materials. No signup, no watermarks, no paywalls
          — just open your browser and start creating.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/editor"
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-6 py-2.5 text-base font-medium text-accent-fg shadow-sm hover:bg-accent-hover sm:w-auto"
          >
            Start Designing — no account needed
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a
            href="https://github.com/pj-casey/Monet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-border bg-elevated px-6 py-2.5 text-base font-medium text-text-primary shadow-sm hover:bg-wash sm:w-auto"
          >
            <GithubIcon size={16} />
            View on GitHub
          </a>
        </div>
        <p className="mt-4 text-sm text-text-tertiary">
          AGPLv3 · React + TypeScript + Fabric.js · Built with{' '}
          <a href="https://claude.ai" target="_blank" rel="noopener noreferrer"
            className="font-medium text-text-secondary hover:text-text-primary">Claude</a>
        </p>

        {/* Hero image — editor screenshot with subtle perspective */}
        <div className="mx-auto mt-12 max-w-4xl">
          <img
            src={`${import.meta.env.BASE_URL}hero-screenshot.png`}
            alt="Monet editor showing a design template with gradient fills, text shadows, and the properties panel"
            className="w-full rounded-lg shadow-xl"
            style={{
              transform: 'perspective(2000px) rotateY(-2deg)',
            }}
            loading="eager"
            onError={(e) => {
              // Fallback to gradient placeholder if screenshot doesn't exist yet
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          {/* Fallback gradient — shown only if screenshot fails to load */}
          <div
            className="hidden aspect-video items-center justify-center rounded-lg shadow-xl"
            style={{
              background: 'linear-gradient(135deg, var(--accent-subtle), var(--bg-wash), var(--accent-subtle))',
            }}
          />
        </div>
      </section>

      {/* ─── Features — show don't tell ─────────────────────── */}
      <section
        id="features"
        ref={featuresRef as React.RefObject<HTMLElement>}
        className="mx-auto max-w-5xl px-6 pb-24"
      >
        <h2 className="mb-4 text-center font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          What you get
        </h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-base leading-relaxed text-text-secondary">
          Everything Canva Pro charges $15/month for. Free.
        </p>

        {/* Feature 1 — AI Design Generation (most "wow" feature) */}
        <div className="mb-20 flex flex-col items-center gap-8 md:flex-row md:gap-12">
          <div className="flex-1">
            <h3 className="mb-3 text-xl font-semibold text-text-primary">Describe it. Design it.</h3>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              Type a description like "minimalist podcast cover with dark gradient and audio waveform"
              and Claude generates a complete, editable design — with gradient fills, shadows, and
              real content. Use your own Anthropic API key. Don't have one? The app works
              100% without AI. No vendor lock-in. No usage-based pricing.
            </p>
            <p className="text-sm text-text-tertiary">
              Generate designs · Rewrite copy · Remove backgrounds · Get design feedback
            </p>
          </div>
          <div className="w-full max-w-xs rounded-lg border border-border bg-elevated p-4 shadow-sm md:w-80">
            <div className="mb-2 rounded bg-canvas p-3 font-mono text-xs text-text-secondary">
              <span className="text-accent">&gt;</span> "Create a tech conference badge with teal accents"
            </div>
            <div className="rounded bg-accent-subtle p-3 text-xs text-text-secondary">
              ✓ Generated 21-object design with gradient fills, role pill, QR placeholder, and WiFi info
            </div>
            <p className="mt-3 text-center text-[10px] text-text-tertiary">Bring your own API key · works without AI too</p>
          </div>
        </div>

        {/* Feature 2 — Canvas Engine (proves it's not a toy) */}
        <div className="mb-20 flex flex-col-reverse items-center gap-8 md:flex-row md:gap-12">
          <div className="w-full max-w-xs rounded-lg border border-border bg-elevated p-4 shadow-sm md:w-80">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="inline-block h-4 w-4 rounded-sm" style={{ background: 'linear-gradient(135deg, #C4704A, #e8956d)' }} />
                Gradient fills (linear + radial)
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="inline-block h-4 w-4 rounded-sm bg-text-primary" style={{ boxShadow: '2px 2px 4px rgba(0,0,0,0.3)' }} />
                Drop shadows with colored glow
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="inline-block h-4 w-4 rounded-sm border border-border" />
                13 shape types (hearts, stars, hexagons...)
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="inline-block h-4 w-4 rounded-sm bg-accent opacity-50" />
                Text effects, blend modes, opacity
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="inline-block h-4 w-4 rounded-sm" style={{ background: 'repeating-linear-gradient(45deg, #ccc, #ccc 2px, #fff 2px, #fff 4px)' }} />
                16 image filters + non-destructive crop
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="inline-block h-4 w-4 rounded-sm border-2 border-accent" />
                Multi-page designs + pen tool
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="mb-3 text-xl font-semibold text-text-primary">Professional-grade canvas</h3>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              Built on Fabric.js with a full properties panel. Gradient fills, drop shadows,
              text stroke, blend modes, clipping masks, non-destructive crop, 16 image filters,
              multi-page designs, and a pen tool for vector paths.
              Not a template-swapper — it's a real design editor.
            </p>
            <p className="text-sm text-text-tertiary">
              1,900+ Google Fonts · Font pairing · Color harmony · Brand kits · Rulers · Smart guides
            </p>
          </div>
        </div>

        {/* Feature 3 — Templates (reframed as starting points) */}
        <div className="mb-20 flex flex-col items-center gap-8 md:flex-row md:gap-12">
          <div className="flex-1">
            <h3 className="mb-3 text-xl font-semibold text-text-primary">Start with a template, or start from scratch</h3>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              Hand-crafted designs across 8 categories — social media, business, marketing,
              events, education, creative, food, and seasonal. Every template uses real content
              and the full feature set: gradients, shadows, custom shapes. Fully editable
              — change anything, or start with a blank canvas.
            </p>
            <p className="text-sm text-text-tertiary">
              Instagram · YouTube · LinkedIn · Invoices · Resumes · Menus · Posters · and more
            </p>
          </div>
          <div className="w-full max-w-xs md:w-80">
            <TemplatePreviews />
          </div>
        </div>

        {/* Feature 4 — Export */}
        <div className="flex flex-col-reverse items-center gap-8 md:flex-row md:gap-12">
          <div className="w-full max-w-xs rounded-lg border border-border bg-elevated p-4 shadow-sm md:w-80">
            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex items-center justify-between"><span>PNG</span><span className="text-text-tertiary">Up to 3x resolution</span></div>
              <div className="flex items-center justify-between"><span>PDF</span><span className="text-text-tertiary">Multi-page support</span></div>
              <div className="flex items-center justify-between"><span>SVG</span><span className="text-text-tertiary">Vector output</span></div>
              <div className="flex items-center justify-between"><span>JPG</span><span className="text-text-tertiary">Compressed</span></div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between"><span>Transparent PNG</span><Check size={14} className="text-accent" /></div>
              <div className="flex items-center justify-between"><span>Batch export (ZIP)</span><Check size={14} className="text-accent" /></div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="mb-3 text-xl font-semibold text-text-primary">Export everything, everywhere</h3>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              PNG, JPG, SVG, and multi-page PDF. Transparent backgrounds. Up to 3x resolution.
              Magic Resize scales your design to any format — batch export all sizes as a ZIP.
              No watermarks. No "upgrade to download."
            </p>
            <p className="text-sm text-text-tertiary">
              Multi-page PDF · Magic Resize · Batch ZIP export · .monet file format
            </p>
          </div>
        </div>
      </section>

      {/* ─── Self-Hosting ────────────────────────────────────── */}
      <section
        id="self-host"
        ref={selfHostRef as React.RefObject<HTMLElement>}
        className="border-t border-border bg-canvas"
      >
        <div className="mx-auto max-w-4xl px-6 py-24">
          <h2 className="mb-4 text-center font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Your designs. Your server.
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-base leading-relaxed text-text-secondary">
            Deploy your own instance in under a minute.
            SQLite database, no external dependencies. Docker or bare metal.
          </p>

          <div className="overflow-hidden rounded-lg border border-border shadow-sm">
            {/* Terminal chrome */}
            <div className="flex h-9 items-center gap-2 bg-elevated px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="ml-3 flex items-center gap-1 text-xs text-text-tertiary">
                <Terminal size={12} />
                terminal
              </span>
            </div>
            {/* Code block */}
            <div className="bg-canvas p-6 font-mono text-sm leading-relaxed">
              <div className="text-text-tertiary"># Clone and start</div>
              <div className="mt-1">
                <span className="text-accent">$</span>
                <span className="text-text-primary"> git clone https://github.com/pj-casey/Monet.git</span>
              </div>
              <div className="mt-1">
                <span className="text-accent">$</span>
                <span className="text-text-primary"> cd Monet</span>
              </div>
              <div className="mt-1">
                <span className="text-accent">$</span>
                <span className="text-text-primary"> docker compose up</span>
              </div>
              <div className="mt-3 text-text-tertiary"># That's it. Open http://localhost:3000</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="https://github.com/pj-casey/Monet/blob/main/SELF-HOSTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent hover:text-accent-hover hover:underline"
            >
              Read the self-hosting guide →
            </a>
          </div>
        </div>
      </section>

      {/* ─── Comparison ──────────────────────────────────────── */}
      <section
        id="compare"
        ref={comparisonRef as React.RefObject<HTMLElement>}
        className="mx-auto max-w-4xl px-6 py-24"
      >
        <h2 className="mb-4 text-center font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Honest comparison
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-base leading-relaxed text-text-secondary">
          We believe in transparency. Here's how Monet stacks up.
        </p>

        <div className="overflow-x-auto overflow-y-hidden rounded-lg border border-border shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 text-left font-medium text-text-secondary" />
                <th className="px-4 py-3 text-center font-semibold text-accent">Monet</th>
                <th className="px-4 py-3 text-center font-medium text-text-secondary">Canva Free</th>
                <th className="px-4 py-3 text-center font-medium text-text-secondary">Canva Pro</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-border last:border-b-0 ${i % 2 === 0 ? 'bg-elevated' : 'bg-surface'}`}
                >
                  <td className="px-4 py-3 font-medium text-text-primary">{row.label}</td>
                  <td className="px-4 py-3 text-center"><CellDisplay value={row.monet} label={`Monet ${row.label}`} /></td>
                  <td className="px-4 py-3 text-center text-text-secondary"><CellDisplay value={row.canvaFree} label={`Canva Free ${row.label}`} /></td>
                  <td className="px-4 py-3 text-center text-text-secondary"><CellDisplay value={row.canvaPro} label={`Canva Pro ${row.label}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Open Source ─────────────────────────────────────── */}
      <section
        id="open-source"
        ref={openSourceRef as React.RefObject<HTMLElement>}
        className="border-t border-border bg-canvas"
      >
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="mb-4 font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Built in the open
          </h2>
          <p className="mx-auto mb-4 max-w-xl text-base leading-relaxed text-text-secondary">
            Monet is open source under the AGPLv3 license.
            Every line of code is public, auditable, and yours to modify.
          </p>
          <p className="mb-10 text-sm text-text-tertiary">
            React 18 · TypeScript · Fabric.js v6 · Tailwind CSS · Zustand · Vite · Built with Claude by Anthropic
          </p>

          {/* GitHub badge */}
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-4 py-2 shadow-sm">
            <GithubIcon size={16} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">pj-casey/Monet</span>
            <span className="rounded-full bg-accent-subtle px-2 py-0.5 text-xs font-medium text-accent">
              AGPLv3
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="https://github.com/pj-casey/Monet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-5 py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover sm:w-auto"
            >
              <GithubIcon size={16} />
              View on GitHub
            </a>
            <a
              href="https://github.com/pj-casey/Monet/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-border bg-elevated px-5 py-2 text-sm font-medium text-text-primary hover:bg-wash sm:w-auto"
            >
              Contributions welcome
            </a>
          </div>
        </div>
      </section>

      {/* ─── Support Monet ──────────────────────────────────── */}
      <section
        ref={supportRef as React.RefObject<HTMLElement>}
        className="border-t border-border bg-surface"
      >
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            Support the project
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-sm leading-relaxed text-text-secondary">
            Monet is free and open source. If it saves you money, consider supporting development.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* GitHub Sponsors */}
            <div className="rounded-lg border border-border bg-elevated p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-accent-subtle mx-auto">
                <Heart size={18} className="text-accent" aria-hidden="true" />
              </div>
              <h3 className="mb-1 text-sm font-medium text-text-primary">GitHub Sponsors</h3>
              <p className="mb-3 text-xs text-text-tertiary">Monthly or one-time</p>
              <a href="https://github.com/sponsors/pj-casey" target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium text-accent hover:text-accent-hover hover:underline">
                Sponsor on GitHub
              </a>
            </div>

            {/* Open Collective */}
            <div className="rounded-lg border border-border bg-elevated p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-accent-subtle mx-auto">
                <Users size={18} className="text-accent" aria-hidden="true" />
              </div>
              <h3 className="mb-1 text-sm font-medium text-text-primary">Open Collective</h3>
              <p className="mb-3 text-xs text-text-tertiary">Transparent finances</p>
              <a href="https://opencollective.com/claude-monet" target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium text-accent hover:text-accent-hover hover:underline">
                Contribute on Open Collective
              </a>
            </div>

            {/* Contribute */}
            <div className="rounded-lg border border-border bg-elevated p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-accent-subtle mx-auto">
                <GithubIcon size={18} className="text-accent" />
              </div>
              <h3 className="mb-1 text-sm font-medium text-text-primary">Contribute</h3>
              <p className="mb-3 text-xs text-text-tertiary">Code, templates, translations</p>
              <a href="https://github.com/pj-casey/Monet" target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium text-accent hover:text-accent-hover hover:underline">
                View on GitHub
              </a>
            </div>
          </div>

          {/* Crypto addresses */}
          <p className="mt-10 mb-4 text-xs text-text-tertiary">Also accepting crypto</p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
            <CryptoAddr label="BTC" address="bc1qws49067r4220vsf60ftg70fmnhmn2s24evnk8d" />
            <CryptoAddr label="ETH" address="0x149F845Cb27b0cFA7AFaFC893e8620228b052731" />
            <CryptoAddr label="SOL" address="8gRPQgjESd8cCWGtCnBv48FHeAAYaZVBdzzDqoJfN7Zr" />
          </div>
        </div>
      </section>

      {/* ─── Final CTA ──────────────────────────────────────── */}
      <section
        ref={ctaRef as React.RefObject<HTMLElement>}
        className="border-t border-border bg-canvas"
      >
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="mb-4 font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Try it now
          </h2>
          <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-text-secondary">
            No signup. No download. Just open the editor and start designing.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/editor"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-8 py-3 text-base font-medium text-accent-fg shadow-sm hover:bg-accent-hover sm:w-auto"
            >
              Start Designing
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              href="https://github.com/pj-casey/Monet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-border bg-elevated px-8 py-3 text-base font-medium text-text-primary shadow-sm hover:bg-wash sm:w-auto"
            >
              <GithubIcon size={16} />
              View Source
            </a>
          </div>
        </div>
      </section>

      </main>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-8 sm:flex-row sm:justify-between">
          <span className="flex items-center gap-1.5 font-display text-sm font-medium text-text-tertiary">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width="14" height="14" className="block opacity-60" aria-hidden="true" />
            Monet
          </span>
          <div className="flex items-center gap-4 text-xs text-text-tertiary">
            <a
              href="https://github.com/pj-casey/Monet"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-secondary"
            >
              GitHub
            </a>
            <span>AGPLv3</span>
            <span className="flex items-center gap-1">
              Made with <Heart size={12} className="text-accent" aria-hidden="true" /> and Claude
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CryptoAddr({ label, address }: { label: string; address: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [address]);
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return (
    <button type="button" onClick={handleCopy} title={`Copy ${label} address`}
      className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary">
      <span className="font-medium text-text-secondary">{label}</span>
      <span className="font-mono">{short}</span>
      <span className="text-[10px]" aria-label={copied ? 'Copied' : 'Copy'}>{copied ? '✓' : '⧉'}</span>
    </button>
  );
}

// ─── Template previews for the "Start with a template" section ─────────

/**
 * Hand-curated 6 best templates for the landing page preview grid.
 * Chosen for visual variety: dark/light contrast, diverse categories,
 * and distinct aesthetics. Ordered for a pleasing 3x2 grid:
 *   Row 1: dark podcast | light wedding | dark concert
 *   Row 2: warm gala    | fun halloween | dark product
 */
const SHOWCASE_IDS = [
  'podcast-cover',       // Dark gradient spotlight with waveform
  'wedding-emma-james',  // Elegant light floral
  'concert-midnight',    // Dramatic heavy typography with glow
  'gala-evening',        // Art deco warm gold
  'halloween-dare',      // Fun spooky with pumpkin and bats
  'product-launch',      // Dark tech product announcement
];
const _idLookup = new Map(TEMPLATE_REGISTRY.map((t) => [t.templateId, t]));
const PREVIEW_TEMPLATES = SHOWCASE_IDS.map((id) => _idLookup.get(id)).filter(Boolean) as typeof TEMPLATE_REGISTRY;

const _lpThumbCache = new Map<string, string>();

function TemplatePreviews() {
  const [thumbs, setThumbs] = useState<Map<string, string>>(_lpThumbCache);

  useEffect(() => {
    if (_lpThumbCache.size >= PREVIEW_TEMPLATES.length) return;
    let cancelled = false;
    (async () => {
      for (const t of PREVIEW_TEMPLATES) {
        if (_lpThumbCache.has(t.templateId) || cancelled) continue;
        try {
          const url = await renderTemplateThumbnail(t.document, 300);
          if (url && !cancelled) {
            _lpThumbCache.set(t.templateId, url);
            setThumbs(new Map(_lpThumbCache));
          }
        } catch { /* skip failed renders */ }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="rounded-lg border border-border bg-elevated p-3 shadow-sm">
      <div className="grid grid-cols-3 gap-2">
        {PREVIEW_TEMPLATES.map((t) => {
          const thumb = thumbs.get(t.templateId);
          const bg = t.document.background;
          const fallback = bg.type === 'solid' ? bg.value : '#e5ddd5';
          return (
            <div key={t.templateId} className="aspect-square overflow-hidden rounded" style={{ backgroundColor: fallback }}>
              {thumb ? (
                <img src={thumb} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="h-full w-full animate-pulse" style={{ backgroundColor: fallback }} />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-text-tertiary">
        {TEMPLATE_REGISTRY.length}+ templates across 8 categories
      </p>
    </div>
  );
}
