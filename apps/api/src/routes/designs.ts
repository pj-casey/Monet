/**
 * Designs API routes — CRUD for saved designs.
 *
 * GET    /api/designs          — list all designs (metadata only, no full document)
 * GET    /api/designs/:id      — get a single design with full document
 * POST   /api/designs          — create a new design
 * PUT    /api/designs/:id      — update an existing design
 * DELETE /api/designs/:id      — delete a design
 */

import { Hono } from 'hono';
import {
  getAllDesigns,
  getDesignById,
  upsertDesign,
  deleteDesignById,
  type DesignRow,
} from '../db.js';

export const designsRouter = new Hono();

/** List all designs — returns metadata without the full document JSON (for dashboard listing) */
designsRouter.get('/', (c) => {
  const designs = getAllDesigns();
  // Return lightweight list (without the full document body)
  const list = designs.map((d) => ({
    id: d.id,
    name: d.name,
    thumbnail: d.thumbnail,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  }));
  return c.json(list);
});

/** Get a single design with full document */
designsRouter.get('/:id', (c) => {
  const id = c.req.param('id');
  const design = getDesignById(id);
  if (!design) {
    return c.json({ error: 'Design not found' }, 404);
  }
  return c.json({
    id: design.id,
    name: design.name,
    thumbnail: design.thumbnail,
    document: JSON.parse(design.document),
    createdAt: design.created_at,
    updatedAt: design.updated_at,
  });
});

/** Create a new design */
designsRouter.post('/', async (c) => {
  const body = await c.req.json();

  if (!body.id || !body.document) {
    return c.json({ error: 'Missing required fields: id, document' }, 400);
  }

  const now = new Date().toISOString();
  const row: DesignRow = {
    id: body.id,
    name: body.name || 'Untitled',
    document: JSON.stringify(body.document),
    thumbnail: body.thumbnail || '',
    created_at: body.createdAt || now,
    updated_at: now,
  };

  upsertDesign(row);
  return c.json({ id: row.id, message: 'Created' }, 201);
});

/** Update an existing design */
designsRouter.put('/:id', async (c) => {
  const id = c.req.param('id');
  const existing = getDesignById(id);

  if (!existing) {
    return c.json({ error: 'Design not found' }, 404);
  }

  const body = await c.req.json();
  const now = new Date().toISOString();

  const row: DesignRow = {
    id,
    name: body.name ?? existing.name,
    document: body.document ? JSON.stringify(body.document) : existing.document,
    thumbnail: body.thumbnail ?? existing.thumbnail,
    created_at: existing.created_at,
    updated_at: now,
  };

  upsertDesign(row);
  return c.json({ id, message: 'Updated' });
});

/** Delete a design */
designsRouter.delete('/:id', (c) => {
  const id = c.req.param('id');
  const existing = getDesignById(id);

  if (!existing) {
    return c.json({ error: 'Design not found' }, 404);
  }

  deleteDesignById(id);
  return c.json({ id, message: 'Deleted' });
});
