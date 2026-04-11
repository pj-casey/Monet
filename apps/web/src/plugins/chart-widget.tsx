/**
 * Chart Widget Plugin — creates simple SVG charts on the canvas.
 *
 * Supports bar, line, and pie charts. User enters comma-separated
 * values, picks a chart type, and clicks insert. The chart is
 * generated as an SVG string and added to the canvas as an
 * editable illustration group.
 *
 * No external chart library — SVG is generated from scratch.
 */

import { useState, useCallback } from 'react';
import type { MonetPlugin, PluginAPI } from '../lib/plugin-api';

let pluginAPI: PluginAPI | null = null;

type ChartType = 'bar' | 'line' | 'pie';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

/** Generate a bar chart SVG from data values */
function buildBarChart(values: number[], labels: string[]): string {
  const w = 400, h = 300, pad = 40;
  const max = Math.max(...values, 1);
  const barW = (w - pad * 2) / values.length - 4;
  const chartH = h - pad * 2;

  const bars = values.map((v, i) => {
    const barH = (v / max) * chartH;
    const x = pad + i * (barW + 4) + 2;
    const y = pad + chartH - barH;
    const color = COLORS[i % COLORS.length];
    const label = labels[i] || '';
    return `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${color}" rx="3"/>` +
      `<text x="${x + barW / 2}" y="${h - 8}" text-anchor="middle" font-size="10" fill="#64748b" font-family="sans-serif">${label}</text>` +
      `<text x="${x + barW / 2}" y="${y - 5}" text-anchor="middle" font-size="11" fill="#374151" font-family="sans-serif">${v}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none">
    <rect width="${w}" height="${h}" fill="#ffffff" rx="8"/>
    <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${h - pad}" stroke="#e2e8f0" stroke-width="1"/>
    <line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="#e2e8f0" stroke-width="1"/>
    ${bars}
  </svg>`;
}

/** Generate a line chart SVG */
function buildLineChart(values: number[], labels: string[]): string {
  const w = 400, h = 300, pad = 40;
  const max = Math.max(...values, 1);
  const chartW = w - pad * 2;
  const chartH = h - pad * 2;
  const step = values.length > 1 ? chartW / (values.length - 1) : 0;

  const points = values.map((v, i) => {
    const x = pad + i * step;
    const y = pad + chartH - (v / max) * chartH;
    return `${x},${y}`;
  });

  const dots = values.map((v, i) => {
    const x = pad + i * step;
    const y = pad + chartH - (v / max) * chartH;
    const label = labels[i] || '';
    return `<circle cx="${x}" cy="${y}" r="4" fill="#3b82f6"/>` +
      `<text x="${x}" y="${h - 8}" text-anchor="middle" font-size="10" fill="#64748b" font-family="sans-serif">${label}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none">
    <rect width="${w}" height="${h}" fill="#ffffff" rx="8"/>
    <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${h - pad}" stroke="#e2e8f0" stroke-width="1"/>
    <line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="#e2e8f0" stroke-width="1"/>
    <polyline points="${points.join(' ')}" stroke="#3b82f6" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
    ${dots}
  </svg>`;
}

/** Generate a pie chart SVG */
function buildPieChart(values: number[], labels: string[]): string {
  const w = 400, h = 300;
  const cx = w / 2, cy = h / 2 - 10, r = 100;
  const total = values.reduce((s, v) => s + v, 0) || 1;

  let angle = -Math.PI / 2;
  const slices = values.map((v, i) => {
    const fraction = v / total;
    const startAngle = angle;
    const endAngle = angle + fraction * Math.PI * 2;
    angle = endAngle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = fraction > 0.5 ? 1 : 0;
    const color = COLORS[i % COLORS.length];

    return `<path d="M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${color}"/>`;
  }).join('');

  const legend = values.map((v, i) => {
    const label = labels[i] || `${Math.round(v / total * 100)}%`;
    const color = COLORS[i % COLORS.length];
    return `<rect x="${20 + i * 80}" y="${h - 25}" width="10" height="10" rx="2" fill="${color}"/>` +
      `<text x="${34 + i * 80}" y="${h - 16}" font-size="10" fill="#374151" font-family="sans-serif">${label}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none">
    <rect width="${w}" height="${h}" fill="#ffffff" rx="8"/>
    ${slices}
    ${legend}
  </svg>`;
}

function ChartWidgetPanel() {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [dataInput, setDataInput] = useState('40, 65, 30, 80, 55');
  const [labelsInput, setLabelsInput] = useState('Mon, Tue, Wed, Thu, Fri');

  const handleInsert = useCallback(async () => {
    if (!pluginAPI) return;

    const values = dataInput.split(',').map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
    const labels = labelsInput.split(',').map((s) => s.trim());

    if (values.length === 0) return;

    let svg: string;
    switch (chartType) {
      case 'bar': svg = buildBarChart(values, labels); break;
      case 'line': svg = buildLineChart(values, labels); break;
      case 'pie': svg = buildPieChart(values, labels); break;
    }

    await pluginAPI.canvas.addIllustration(svg);
  }, [chartType, dataInput, labelsInput]);

  return (
    <div>
      {/* Chart type */}
      <label className="mb-1 block text-xs font-medium text-text-secondary">Type</label>
      <div className="mb-2 flex gap-1">
        {(['bar', 'line', 'pie'] as ChartType[]).map((t) => (
          <button key={t} type="button" onClick={() => setChartType(t)}
            className={`flex-1 rounded px-2 py-1 text-xs font-medium ${
              chartType === t ? 'bg-accent-subtle text-accent' : 'bg-wash text-text-secondary'
            }`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Data values */}
      <label className="mb-1 block text-xs font-medium text-text-secondary">Values</label>
      <input type="text" value={dataInput} onChange={(e) => setDataInput(e.target.value)}
        placeholder="40, 65, 30, 80"
        className="mb-2 w-full rounded border border-border px-2 py-1.5 text-xs" />

      {/* Labels */}
      <label className="mb-1 block text-xs font-medium text-text-secondary">Labels</label>
      <input type="text" value={labelsInput} onChange={(e) => setLabelsInput(e.target.value)}
        placeholder="Mon, Tue, Wed, Thu"
        className="mb-3 w-full rounded border border-border px-2 py-1.5 text-xs" />

      <button type="button" onClick={handleInsert}
        className="w-full rounded bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:bg-accent-hover">
        Insert Chart
      </button>
    </div>
  );
}

export const chartWidgetPlugin: MonetPlugin = {
  name: 'Chart Widget',
  version: '1.0.0',
  init(api) {
    pluginAPI = api;
    api.ui.registerPanel({
      id: 'chart-widget:main',
      label: 'Charts',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="8" width="3" height="6" rx="0.5" fill="currentColor" opacity="0.3" />
          <rect x="6.5" y="4" width="3" height="10" rx="0.5" fill="currentColor" opacity="0.5" />
          <rect x="11" y="2" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.7" />
        </svg>
      ),
      component: ChartWidgetPanel,
    });
  },
  destroy() {
    pluginAPI = null;
  },
};
