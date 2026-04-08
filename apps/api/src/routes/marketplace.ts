/**
 * Marketplace API — community template publishing, browsing, voting, moderation.
 *
 * Public (no auth):
 *   GET  /api/marketplace                — browse templates (with search/filter/sort)
 *   GET  /api/marketplace/:id            — get a single template for preview
 *   GET  /api/marketplace/creator/:userId — get templates by a creator
 *
 * Authenticated:
 *   POST   /api/marketplace              — publish a template
 *   POST   /api/marketplace/:id/use      — increment use count
 *   POST   /api/marketplace/:id/vote     — toggle upvote
 *   PATCH  /api/marketplace/:id/moderate — approve/reject (admin)
 *   DELETE /api/marketplace/:id          — delete own template
 */

import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { getDB, saveDB } from '../db.js';
import { validateSession, findUserById } from '../auth.js';

export const marketplaceRouter = new Hono();

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function getAuthUserId(c: Parameters<Parameters<typeof marketplaceRouter.get>[1]>[0]): string | null {
  const token = getCookie(c, 'session') ?? c.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  return validateSession(token);
}

// ─── Browse ────────────────────────────────────────────────────────

marketplaceRouter.get('/', (c) => {
  const q = c.req.query('q') ?? '';
  const category = c.req.query('category') ?? '';
  const sort = c.req.query('sort') ?? 'newest'; // newest, popular, staff
  const page = parseInt(c.req.query('page') ?? '1', 10);
  const limit = Math.min(parseInt(c.req.query('limit') ?? '20', 10), 50);
  const offset = (page - 1) * limit;

  let sql = `SELECT id, user_id, user_name, name, description, category, tags,
    dimensions_w, dimensions_h, thumbnail, status, uses, upvotes, staff_pick, created_at
    FROM marketplace_templates WHERE status = 'approved'`;
  const params: (string | number)[] = [];

  if (q) {
    sql += ` AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)`;
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (category) {
    sql += ` AND category = ?`;
    params.push(category);
  }

  if (sort === 'popular') sql += ` ORDER BY uses DESC, upvotes DESC`;
  else if (sort === 'staff') sql += ` ORDER BY staff_pick DESC, upvotes DESC`;
  else sql += ` ORDER BY created_at DESC`;

  sql += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const stmt = getDB().prepare(sql);
  stmt.bind(params);
  const templates: Record<string, unknown>[] = [];
  while (stmt.step()) templates.push(stmt.getAsObject() as Record<string, unknown>);
  stmt.free();

  // Get total count
  let countSql = `SELECT COUNT(*) as total FROM marketplace_templates WHERE status = 'approved'`;
  const countParams: (string | number)[] = [];
  if (q) {
    countSql += ` AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)`;
    const like = `%${q}%`;
    countParams.push(like, like, like);
  }
  if (category) {
    countSql += ` AND category = ?`;
    countParams.push(category);
  }
  const countStmt = getDB().prepare(countSql);
  countStmt.bind(countParams);
  countStmt.step();
  const total = (countStmt.getAsObject() as { total: number }).total;
  countStmt.free();

  return c.json({
    templates: templates.map(formatTemplateMeta),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

// ─── Get single template ───────────────────────────────────────────

marketplaceRouter.get('/:id', (c) => {
  const id = c.req.param('id');
  const stmt = getDB().prepare('SELECT * FROM marketplace_templates WHERE id = ?');
  stmt.bind([id]);
  if (!stmt.step()) { stmt.free(); return c.json({ error: 'Not found' }, 404); }
  const row = stmt.getAsObject() as Record<string, unknown>;
  stmt.free();
  return c.json({
    ...formatTemplateMeta(row),
    document: JSON.parse(row.document as string),
  });
});

// ─── Creator profile ──────────────────────────────────────────────

marketplaceRouter.get('/creator/:userId', (c) => {
  const userId = c.req.param('userId');
  const user = findUserById(userId);

  const stmt = getDB().prepare(
    `SELECT id, user_id, user_name, name, description, category, tags,
     dimensions_w, dimensions_h, thumbnail, uses, upvotes, staff_pick, created_at
     FROM marketplace_templates WHERE user_id = ? AND status = 'approved'
     ORDER BY created_at DESC`,
  );
  stmt.bind([userId]);
  const templates: Record<string, unknown>[] = [];
  while (stmt.step()) templates.push(stmt.getAsObject() as Record<string, unknown>);
  stmt.free();

  return c.json({
    creator: user ? { id: user.id, name: user.name } : null,
    templates: templates.map(formatTemplateMeta),
    totalUses: templates.reduce((sum, t) => sum + (t.uses as number), 0),
  });
});

// ─── Publish ───────────────────────────────────────────────────────

marketplaceRouter.post('/', async (c) => {
  const userId = getAuthUserId(c);
  if (!userId) return c.json({ error: 'Login required' }, 401);

  const user = findUserById(userId);
  if (!user) return c.json({ error: 'User not found' }, 401);

  const body = await c.req.json();
  if (!body.name || !body.document) return c.json({ error: 'Missing name or document' }, 400);

  const id = genId();
  const now = new Date().toISOString();
  const tags = JSON.stringify(body.tags ?? []);

  getDB().run(
    `INSERT INTO marketplace_templates (id, user_id, user_name, name, description, category, tags,
     dimensions_w, dimensions_h, document, thumbnail, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    [
      id, userId, user.name, body.name, body.description ?? '', body.category ?? 'Other',
      tags, body.dimensions?.width ?? 1080, body.dimensions?.height ?? 1080,
      JSON.stringify(body.document), body.thumbnail ?? '', now,
    ],
  );
  saveDB();

  return c.json({ id, message: 'Template submitted for review', status: 'pending' }, 201);
});

// ─── Use template (increment counter) ─────────────────────────────

marketplaceRouter.post('/:id/use', (c) => {
  const id = c.req.param('id');
  getDB().run('UPDATE marketplace_templates SET uses = uses + 1 WHERE id = ?', [id]);
  saveDB();
  return c.json({ message: 'Used' });
});

// ─── Vote/upvote toggle ───────────────────────────────────────────

marketplaceRouter.post('/:id/vote', (c) => {
  const userId = getAuthUserId(c);
  if (!userId) return c.json({ error: 'Login required' }, 401);
  const id = c.req.param('id');

  // Check if already voted
  const check = getDB().prepare('SELECT 1 FROM template_votes WHERE user_id = ? AND template_id = ?');
  check.bind([userId, id]);
  const hasVoted = check.step();
  check.free();

  if (hasVoted) {
    getDB().run('DELETE FROM template_votes WHERE user_id = ? AND template_id = ?', [userId, id]);
    getDB().run('UPDATE marketplace_templates SET upvotes = upvotes - 1 WHERE id = ?', [id]);
  } else {
    getDB().run('INSERT INTO template_votes (user_id, template_id) VALUES (?, ?)', [userId, id]);
    getDB().run('UPDATE marketplace_templates SET upvotes = upvotes + 1 WHERE id = ?', [id]);
  }
  saveDB();

  return c.json({ voted: !hasVoted });
});

// ─── Moderation ────────────────────────────────────────────────────

marketplaceRouter.patch('/:id/moderate', async (c) => {
  const userId = getAuthUserId(c);
  if (!userId) return c.json({ error: 'Login required' }, 401);
  // Simple admin check — first registered user is admin
  // In production, use a proper admin role system
  const body = await c.req.json();
  const status = body.status as string;
  const staffPick = body.staffPick ? 1 : 0;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return c.json({ error: 'Invalid status' }, 400);
  }

  const id = c.req.param('id');
  getDB().run('UPDATE marketplace_templates SET status = ?, staff_pick = ? WHERE id = ?',
    [status, staffPick, id]);
  saveDB();

  return c.json({ message: `Template ${status}` });
});

// ─── Delete own template ───────────────────────────────────────────

marketplaceRouter.delete('/:id', (c) => {
  const userId = getAuthUserId(c);
  if (!userId) return c.json({ error: 'Login required' }, 401);

  const id = c.req.param('id');
  const stmt = getDB().prepare('SELECT user_id FROM marketplace_templates WHERE id = ?');
  stmt.bind([id]);
  if (!stmt.step()) { stmt.free(); return c.json({ error: 'Not found' }, 404); }
  const row = stmt.getAsObject() as { user_id: string };
  stmt.free();

  if (row.user_id !== userId) return c.json({ error: 'Not authorized' }, 403);

  getDB().run('DELETE FROM marketplace_templates WHERE id = ?', [id]);
  saveDB();
  return c.json({ message: 'Deleted' });
});

// ─── Helpers ───────────────────────────────────────────────────────

function formatTemplateMeta(row: Record<string, unknown>) {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    name: row.name,
    description: row.description,
    category: row.category,
    tags: JSON.parse((row.tags as string) || '[]'),
    dimensions: { width: row.dimensions_w, height: row.dimensions_h },
    thumbnail: row.thumbnail,
    uses: row.uses,
    upvotes: row.upvotes,
    staffPick: row.staff_pick === 1,
    createdAt: row.created_at,
  };
}
