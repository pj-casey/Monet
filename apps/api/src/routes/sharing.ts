/**
 * Sharing routes — public view-only access to shared designs.
 *
 * GET /api/share/:id — get a design for view-only (no auth required)
 *
 * To share a design, the owner generates a link. Anyone with
 * the link can view (but not edit) the design.
 */

import { Hono } from 'hono';
import { getDesignById } from '../db.js';

export const sharingRouter = new Hono();

/** Get a shared design (public, no auth required) */
sharingRouter.get('/:id', (c) => {
  const id = c.req.param('id');
  const design = getDesignById(id);

  if (!design) {
    return c.json({ error: 'Design not found' }, 404);
  }

  return c.json({
    id: design.id,
    name: design.name,
    document: JSON.parse(design.document),
    createdAt: design.created_at,
    updatedAt: design.updated_at,
  });
});
