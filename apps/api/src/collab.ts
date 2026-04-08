/**
 * Collaboration Server — real-time multi-user editing via Socket.io + Yjs.
 *
 * Features:
 * - Yjs CRDT document sync (conflict-free concurrent editing)
 * - Cursor presence (see others' cursors + selections, color-coded)
 * - Comments (positioned on canvas, threaded replies, resolve/unresolve)
 * - Permissions (owner/editor/viewer per room)
 * - Follow mode (track another user's viewport)
 *
 * Each design is a "room" — users join a room by design ID.
 */

import { Server as SocketServer, type Socket } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import * as Y from 'yjs';

// Store Yjs documents in memory (keyed by design ID)
const docs = new Map<string, Y.Doc>();

// Store room state
interface RoomUser {
  id: string;
  name: string;
  email: string;
  color: string;
  cursor: { x: number; y: number } | null;
  selection: string[];
  role: 'owner' | 'editor' | 'viewer';
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  x: number;
  y: number;
  resolved: boolean;
  createdAt: string;
  replies: CommentReply[];
}

interface CommentReply {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

const rooms = new Map<string, {
  users: Map<string, RoomUser>;
  comments: Comment[];
  permissions: Map<string, 'owner' | 'editor' | 'viewer'>;
}>();

// Assign colors to users in a room
const USER_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e',
];

function getDoc(designId: string): Y.Doc {
  let doc = docs.get(designId);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(designId, doc);
  }
  return doc;
}

function getRoom(designId: string) {
  let room = rooms.get(designId);
  if (!room) {
    room = { users: new Map(), comments: [], permissions: new Map() };
    rooms.set(designId, room);
  }
  return room;
}

/**
 * Initialize Socket.io on the existing HTTP server.
 */
export function initCollaboration(httpServer: HTTPServer): SocketServer {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    let currentRoom: string | null = null;
    let userId = '';
    let userName = '';
    let userEmail = '';

    // ─── Join a design room ───────────────────────────────────────
    socket.on('join-room', (data: {
      designId: string;
      userId: string;
      userName: string;
      userEmail: string;
      role?: 'owner' | 'editor' | 'viewer';
    }) => {
      currentRoom = data.designId;
      userId = data.userId;
      userName = data.userName || 'Anonymous';
      userEmail = data.userEmail || '';

      socket.join(currentRoom);

      const room = getRoom(currentRoom);
      const colorIndex = room.users.size % USER_COLORS.length;
      const role = data.role ?? room.permissions.get(userId) ?? 'editor';

      room.users.set(socket.id, {
        id: userId,
        name: userName,
        email: userEmail,
        color: USER_COLORS[colorIndex],
        cursor: null,
        selection: [],
        role,
      });
      room.permissions.set(userId, role);

      // Send current room state to the joining user
      socket.emit('room-state', {
        users: Array.from(room.users.values()),
        comments: room.comments,
      });

      // Send Yjs document state
      const doc = getDoc(currentRoom);
      const state = Y.encodeStateAsUpdate(doc);
      socket.emit('yjs-sync', Array.from(state));

      // Notify others
      socket.to(currentRoom).emit('user-joined', room.users.get(socket.id));
    });

    // ─── Yjs sync ─────────────────────────────────────────────────
    socket.on('yjs-update', (update: number[]) => {
      if (!currentRoom) return;
      const doc = getDoc(currentRoom);
      Y.applyUpdate(doc, new Uint8Array(update));
      socket.to(currentRoom).emit('yjs-update', update);
    });

    // ─── Cursor presence ──────────────────────────────────────────
    socket.on('cursor-move', (cursor: { x: number; y: number } | null) => {
      if (!currentRoom) return;
      const room = getRoom(currentRoom);
      const user = room.users.get(socket.id);
      if (user) {
        user.cursor = cursor;
        socket.to(currentRoom).emit('cursor-update', {
          socketId: socket.id,
          userId: user.id,
          name: user.name,
          color: user.color,
          cursor,
        });
      }
    });

    socket.on('selection-change', (selection: string[]) => {
      if (!currentRoom) return;
      const room = getRoom(currentRoom);
      const user = room.users.get(socket.id);
      if (user) {
        user.selection = selection;
        socket.to(currentRoom).emit('selection-update', {
          socketId: socket.id,
          userId: user.id,
          color: user.color,
          selection,
        });
      }
    });

    // ─── Follow mode ──────────────────────────────────────────────
    socket.on('viewport-change', (viewport: { zoom: number; panX: number; panY: number }) => {
      if (!currentRoom) return;
      socket.to(currentRoom).emit('viewport-update', {
        socketId: socket.id,
        userId,
        viewport,
      });
    });

    // ─── Comments ─────────────────────────────────────────────────
    socket.on('add-comment', (data: { x: number; y: number; text: string }) => {
      if (!currentRoom) return;
      const room = getRoom(currentRoom);
      const comment: Comment = {
        id: genId(),
        userId,
        userName,
        text: data.text,
        x: data.x,
        y: data.y,
        resolved: false,
        createdAt: new Date().toISOString(),
        replies: [],
      };
      room.comments.push(comment);
      io.to(currentRoom).emit('comment-added', comment);
    });

    socket.on('reply-comment', (data: { commentId: string; text: string }) => {
      if (!currentRoom) return;
      const room = getRoom(currentRoom);
      const comment = room.comments.find((c) => c.id === data.commentId);
      if (!comment) return;
      const reply: CommentReply = {
        id: genId(),
        userId,
        userName,
        text: data.text,
        createdAt: new Date().toISOString(),
      };
      comment.replies.push(reply);
      io.to(currentRoom).emit('comment-reply', { commentId: data.commentId, reply });
    });

    socket.on('resolve-comment', (commentId: string) => {
      if (!currentRoom) return;
      const room = getRoom(currentRoom);
      const comment = room.comments.find((c) => c.id === commentId);
      if (comment) {
        comment.resolved = !comment.resolved;
        io.to(currentRoom).emit('comment-resolved', { commentId, resolved: comment.resolved });
      }
    });

    // ─── Permissions ──────────────────────────────────────────────
    socket.on('set-permission', (data: { targetUserId: string; role: 'editor' | 'viewer' }) => {
      if (!currentRoom) return;
      const room = getRoom(currentRoom);
      const sender = room.users.get(socket.id);
      if (!sender || sender.role !== 'owner') return; // Only owner can change permissions
      room.permissions.set(data.targetUserId, data.role);
      io.to(currentRoom).emit('permission-changed', data);
    });

    // ─── Disconnect ───────────────────────────────────────────────
    socket.on('disconnect', () => {
      if (!currentRoom) return;
      const room = getRoom(currentRoom);
      room.users.delete(socket.id);
      socket.to(currentRoom).emit('user-left', { socketId: socket.id, userId });

      // Clean up empty rooms
      if (room.users.size === 0) {
        rooms.delete(currentRoom);
        docs.delete(currentRoom);
      }
    });
  });

  return io;
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
