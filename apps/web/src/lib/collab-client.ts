/**
 * Collaboration Client — connects to the WebSocket server for real-time editing.
 *
 * Manages: Yjs sync, cursor presence, comments, follow mode.
 * All events are optional — the editor works fully offline.
 */

import { io, type Socket } from 'socket.io-client';

const API_BASE = 'http://localhost:3001';

export interface CollabUser {
  id: string;
  name: string;
  email: string;
  color: string;
  cursor: { x: number; y: number } | null;
  selection: string[];
  role: 'owner' | 'editor' | 'viewer';
}

export interface CollabComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  x: number;
  y: number;
  resolved: boolean;
  createdAt: string;
  replies: { id: string; userId: string; userName: string; text: string; createdAt: string }[];
}

export interface CollabCallbacks {
  onUsersChange?: (users: CollabUser[]) => void;
  onCursorUpdate?: (data: { socketId: string; userId: string; name: string; color: string; cursor: { x: number; y: number } | null }) => void;
  onCommentsChange?: (comments: CollabComment[]) => void;
  onYjsUpdate?: (update: number[]) => void;
  onYjsSync?: (state: number[]) => void;
  onViewportUpdate?: (data: { userId: string; viewport: { zoom: number; panX: number; panY: number } }) => void;
}

let socket: Socket | null = null;
let callbacks: CollabCallbacks = {};
let localComments: CollabComment[] = [];

/** Connect to a collaboration room */
export function joinRoom(
  designId: string,
  user: { id: string; name: string; email: string },
  role: 'owner' | 'editor' | 'viewer',
  cbs: CollabCallbacks,
): void {
  callbacks = cbs;
  if (socket) socket.disconnect();

  socket = io(API_BASE, { withCredentials: true });

  socket.on('connect', () => {
    socket?.emit('join-room', {
      designId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      role,
    });
  });

  socket.on('room-state', (data: { users: CollabUser[]; comments: CollabComment[] }) => {
    localComments = data.comments;
    callbacks.onUsersChange?.(data.users);
    callbacks.onCommentsChange?.(data.comments);
  });

  socket.on('user-joined', () => {
    // Room state will be re-sent
  });

  socket.on('user-left', () => {
    // Handled via room-state updates
  });

  socket.on('yjs-sync', (state: number[]) => callbacks.onYjsSync?.(state));
  socket.on('yjs-update', (update: number[]) => callbacks.onYjsUpdate?.(update));
  socket.on('cursor-update', (data) => callbacks.onCursorUpdate?.(data));
  socket.on('viewport-update', (data) => callbacks.onViewportUpdate?.(data));

  socket.on('comment-added', (comment: CollabComment) => {
    localComments.push(comment);
    callbacks.onCommentsChange?.([...localComments]);
  });

  socket.on('comment-reply', (data: { commentId: string; reply: CollabComment['replies'][0] }) => {
    const c = localComments.find((c) => c.id === data.commentId);
    if (c) c.replies.push(data.reply);
    callbacks.onCommentsChange?.([...localComments]);
  });

  socket.on('comment-resolved', (data: { commentId: string; resolved: boolean }) => {
    const c = localComments.find((c) => c.id === data.commentId);
    if (c) c.resolved = data.resolved;
    callbacks.onCommentsChange?.([...localComments]);
  });
}

/** Leave the current room */
export function leaveRoom(): void {
  socket?.disconnect();
  socket = null;
  localComments = [];
}

/** Send a Yjs update to other collaborators */
export function sendYjsUpdate(update: number[]): void {
  socket?.emit('yjs-update', update);
}

/** Send cursor position */
export function sendCursorMove(cursor: { x: number; y: number } | null): void {
  socket?.emit('cursor-move', cursor);
}

/** Send selection change */
export function sendSelectionChange(selection: string[]): void {
  socket?.emit('selection-change', selection);
}

/** Send viewport change (for follow mode) */
export function sendViewportChange(viewport: { zoom: number; panX: number; panY: number }): void {
  socket?.emit('viewport-change', viewport);
}

/** Add a comment */
export function addComment(x: number, y: number, text: string): void {
  socket?.emit('add-comment', { x, y, text });
}

/** Reply to a comment */
export function replyToComment(commentId: string, text: string): void {
  socket?.emit('reply-comment', { commentId, text });
}

/** Toggle resolved status of a comment */
export function resolveComment(commentId: string): void {
  socket?.emit('resolve-comment', commentId);
}

/** Set a user's permission */
export function setPermission(targetUserId: string, role: 'editor' | 'viewer'): void {
  socket?.emit('set-permission', { targetUserId, role });
}

/** Check if currently connected */
export function isConnected(): boolean {
  return socket?.connected ?? false;
}

/** Generate a collaboration invite link */
export function getInviteLink(designId: string, role: 'editor' | 'viewer'): string {
  return `${window.location.origin}?collab=${designId}&role=${role}`;
}
