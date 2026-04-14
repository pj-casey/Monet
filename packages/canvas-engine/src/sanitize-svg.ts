/**
 * SVG sanitization — strips XSS vectors before Fabric.js parses SVG strings.
 *
 * Uses DOMPurify to remove <script>, <foreignObject>, event handlers
 * (onload, onerror, onclick, etc.), data URIs in attributes, and other
 * dangerous content. Only safe SVG drawing elements are allowed through.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize an SVG string, removing all potential XSS vectors.
 *
 * Allowed: drawing elements (path, circle, rect, text, g, defs, etc.)
 * Removed: script, foreignObject, event handlers, javascript: URIs
 *
 * @param svgString - Raw SVG markup
 * @returns Sanitized SVG markup safe for Fabric.js parsing
 */
export function sanitizeSvg(svgString: string): string {
  return DOMPurify.sanitize(svgString, {
    USE_PROFILES: { svg: true, svgFilters: true },
    // Remove dangerous elements that can execute code
    FORBID_TAGS: ['script', 'foreignObject', 'iframe', 'object', 'embed'],
    // Remove all event handler attributes (on*)
    FORBID_ATTR: [
      'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout',
      'onmouseenter', 'onmouseleave', 'onmousedown', 'onmouseup',
      'onfocus', 'onblur', 'onkeydown', 'onkeyup', 'onkeypress',
      'onchange', 'oninput', 'onsubmit', 'onanimationend',
      'onanimationstart', 'ontouchstart', 'ontouchend',
    ],
  });
}

/**
 * Escape special HTML characters in a string to prevent injection
 * when interpolating into SVG/HTML markup.
 *
 * Use this for user-provided text that will appear inside SVG elements
 * (e.g., chart labels, text content).
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (c) => map[c]);
}
