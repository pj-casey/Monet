/**
 * LandingPage — the "/" route for Monet.
 *
 * A warm, calm, premium marketing page that feels like a sibling to claude.ai.
 * Uses DESIGN.md tokens exclusively. Fraunces for headings, DM Sans for body.
 * Intersection Observer drives subtle fade-in on scroll.
 */

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutTemplate, Type, FileStack, Palette, Sparkles,
  Crop, Download, Server, Check, X, Terminal,
  Heart, ArrowRight, Sun, Moon, Users,
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
/* Feature card data                                                  */
/* ═══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  {
    icon: LayoutTemplate,
    title: '50+ Templates',
    desc: 'Start with professionally designed templates, not a blank canvas.',
  },
  {
    icon: Type,
    title: '1,900+ Fonts',
    desc: 'Google Fonts library with live preview and font pairing suggestions.',
  },
  {
    icon: FileStack,
    title: 'Multi-Page Designs',
    desc: 'Create presentations, carousels, and multi-page PDFs.',
  },
  {
    icon: Palette,
    title: 'Brand Kits',
    desc: 'Save your colors, fonts, and logos. Apply them everywhere.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    desc: 'Bring your own Anthropic API key. Generate designs, rewrite copy, remove backgrounds. Optional \u2014 works fully without it.',
  },
  {
    icon: Crop,
    title: 'Crop & Image Editing',
    desc: 'Non-destructive crop, filters, adjustments, background removal.',
  },
  {
    icon: Download,
    title: 'Export Anything',
    desc: 'PNG, JPG, SVG, multi-page PDF. Transparent backgrounds. Up to 3x resolution.',
  },
  {
    icon: Server,
    title: 'Self-Hostable',
    desc: 'One command: docker compose up. Your data stays yours.',
  },
] as const;

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
  { label: 'Price',              monet: '$0 forever',  canvaFree: '$0',        canvaPro: '$15/mo' },
  { label: 'Templates',         monet: '50+',         canvaFree: '250,000+',  canvaPro: '610,000+' },
  { label: 'Fonts',             monet: '1,900+',      canvaFree: '1,000+',    canvaPro: '3,000+' },
  { label: 'Background Removal', monet: true,         canvaFree: false,       canvaPro: true },
  { label: 'Brand Kit',         monet: true,          canvaFree: false,       canvaPro: true },
  { label: 'Multi-Page',        monet: true,          canvaFree: true,        canvaPro: true },
  { label: 'Custom Export Sizes', monet: true,        canvaFree: false,       canvaPro: true },
  { label: 'AI Features',       monet: 'BYOK',       canvaFree: 'Limited',   canvaPro: true },
  { label: 'Self-Hostable',     monet: true,          canvaFree: false,       canvaPro: false },
  { label: 'Open Source',       monet: true,          canvaFree: false,       canvaPro: false },
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

  return (
    <div className="min-h-screen bg-surface font-sans text-text-primary">

      {/* Skip to content — keyboard accessibility */}
      <button type="button" onClick={() => scrollTo('main-content')} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg focus:shadow-lg">
        Skip to content
      </button>

      {/* ─── Nav ─────────────────────────────────────────────── */}
      <nav aria-label="Main navigation" className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="font-display text-xl font-semibold tracking-tight text-text-primary">
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
              onClick={() => scrollTo('compare')}
              className="hidden text-sm font-medium text-text-secondary hover:text-text-primary sm:block"
            >
              Compare
            </button>
            <button
              type="button"
              onClick={() => scrollTo('self-host')}
              className="hidden text-sm font-medium text-text-secondary hover:text-text-primary md:block"
            >
              Self-Host
            </button>
            <button
              type="button"
              onClick={() => scrollTo('open-source')}
              className="hidden text-sm font-medium text-text-secondary hover:text-text-primary md:block"
            >
              Open Source
            </button>
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
        className="mx-auto max-w-4xl px-6 pb-24 pt-20 text-center sm:pb-32 sm:pt-28"
      >
        <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl">
          Design anything.{' '}
          <br className="hidden sm:block" />
          Free forever.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
          The free, open-source design tool built with Claude.
          No account. No watermarks. No limits.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-2.5 text-base font-medium text-accent-fg shadow-sm hover:bg-accent-hover"
          >
            Start Designing
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a
            href="https://github.com/pj-casey/Monet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-border bg-elevated px-6 py-2.5 text-base font-medium text-text-primary shadow-sm hover:bg-wash"
          >
            <GithubIcon size={16} />
            View on GitHub
          </a>
        </div>
        <p className="mt-6 text-sm text-text-tertiary">
          Built with{' '}
          <a href="https://claude.ai" target="_blank" rel="noopener noreferrer"
            className="font-medium text-text-secondary hover:text-text-primary">Claude</a>
          {' '}by{' '}
          <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer"
            className="font-medium text-text-secondary hover:text-text-primary">Anthropic</a>
        </p>

        {/* Hero image — editor screenshot with subtle perspective */}
        <div className="mx-auto mt-16 max-w-4xl">
          <img
            src={`${import.meta.env.BASE_URL}hero-screenshot.png`}
            alt="Monet editor showing a luxury product launch design with gradient fills, text shadows, and the properties panel"
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

      {/* ─── Features ────────────────────────────────────────── */}
      <section
        id="features"
        ref={featuresRef as React.RefObject<HTMLElement>}
        className="mx-auto max-w-6xl px-6 pb-24"
      >
        <h2 className="mb-4 text-center font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Everything you need
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-base leading-relaxed text-text-secondary">
          A complete design toolkit, without the subscription.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-border bg-elevated p-5 shadow-sm"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-accent-subtle">
                <f.icon size={18} className="text-accent" />
              </div>
              <h3 className="mb-1 text-base font-medium text-text-primary">{f.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Comparison ──────────────────────────────────────── */}
      <section
        id="compare"
        ref={comparisonRef as React.RefObject<HTMLElement>}
        className="mx-auto max-w-4xl px-6 pb-24"
      >
        <h2 className="mb-4 text-center font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Honest comparison
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-base leading-relaxed text-text-secondary">
          We believe in transparency. Here's how Monet stacks up.
        </p>

        <div className="overflow-hidden rounded-lg border border-border shadow-sm">
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

      {/* ─── Self-Hosting ────────────────────────────────────── */}
      <section
        id="self-host"
        ref={selfHostRef as React.RefObject<HTMLElement>}
        className="mx-auto max-w-4xl px-6 pb-24"
      >
        <h2 className="mb-4 text-center font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Your designs. Your server.
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-base leading-relaxed text-text-secondary">
          Deploy your own instance in under a minute.
          SQLite database, no external dependencies.
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
              <span className="text-text-primary"> cd monet</span>
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
            Read the self-hosting guide
          </a>
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
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-text-secondary">
            Monet is open source under the AGPLv3 license.
            Every line of code is public, auditable, and yours to modify.
          </p>
          <p className="mb-10 text-sm text-text-tertiary">
            Built with Claude by Anthropic
          </p>

          {/* GitHub badge placeholder */}
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-4 py-2 shadow-sm">
            <GithubIcon size={16} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">pj-casey/Monet</span>
            <span className="rounded-full bg-accent-subtle px-2 py-0.5 text-xs font-medium text-accent">
              stars
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/pj-casey/Monet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover"
            >
              <GithubIcon size={16} />
              View on GitHub
            </a>
            <a
              href="https://github.com/pj-casey/Monet/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-border bg-elevated px-5 py-2 text-sm font-medium text-text-primary hover:bg-wash"
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

            {/* Direct support */}
            <div className="rounded-lg border border-border bg-elevated p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-accent-subtle mx-auto">
                <GithubIcon size={18} className="text-accent" />
              </div>
              <h3 className="mb-1 text-sm font-medium text-text-primary">Contribute</h3>
              <p className="mb-3 text-xs text-text-tertiary">Code, templates, translations</p>
              <a href="https://github.com/pj-casey/Monet/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium text-accent hover:text-accent-hover hover:underline">
                How to contribute
              </a>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-8 sm:flex-row sm:justify-between">
          <span className="font-display text-sm font-medium text-text-tertiary">
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

