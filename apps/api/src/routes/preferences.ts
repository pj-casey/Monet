/**
 * Preferences API routes — key-value store for user settings.
 *
 * GET  /api/preferences         — get all preferences
 * GET  /api/preferences/:key    — get a single preference
 * PUT  /api/preferences/:key    — set a preference
 */

import { Hono } from 'hono';
import { getAllPreferences, getPreference, setPreference } from '../db.js';

export const preferencesRouter = new Hono();

/** Get all preferences */
preferencesRouter.get('/', (c) => {
  return c.json(getAllPreferences());
});

/** Get a single preference */
preferencesRouter.get('/:key', (c) => {
  const key = c.req.param('key');
  const value = getPreference(key);
  if (value === null) {
    return c.json({ error: 'Preference not found' }, 404);
  }
  return c.json({ key, value });
});

/** Set a preference */
preferencesRouter.put('/:key', async (c) => {
  const key = c.req.param('key');
  const body = await c.req.json();

  if (body.value === undefined) {
    return c.json({ error: 'Missing "value" field' }, 400);
  }

  setPreference(key, String(body.value));
  return c.json({ key, value: body.value, message: 'Saved' });
});
