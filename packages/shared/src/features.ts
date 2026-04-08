/**
 * Feature flags for progressive feature rollout.
 *
 * These are simple booleans that control which features are enabled.
 * Features behind flags are in development or optional (like backend sync).
 * Check in code: if (FEATURES.BACKEND_SYNC) { ... }
 */
export const FEATURES = {
  BACKEND_SYNC: false,
  AI_BACKGROUND_REMOVE: false,
  COLLABORATION: false,
  TEMPLATE_MARKETPLACE: false,
} as const;
