/**
 * useCollaboration — manages the collaboration session lifecycle.
 *
 * Connects to the WebSocket server when a user opens a shared design.
 * Handles cursor tracking, comment state, and follow mode.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  joinRoom,
  leaveRoom,
  sendCursorMove,
  addComment as sendComment,
  isConnected,
  type CollabUser,
  type CollabComment,
} from '../lib/collab-client';
import type { RemoteCursor } from '../components/CursorOverlay';

export function useCollaboration() {
  const [collabUsers, setCollabUsers] = useState<CollabUser[]>([]);
  const [comments, setComments] = useState<CollabComment[]>([]);
  const [cursors, setCursors] = useState<RemoteCursor[]>([]);
  const [followingUserId, setFollowingUserId] = useState<string | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const cursorMapRef = useRef(new Map<string, RemoteCursor>());

  /** Start a collaboration session for a design */
  const startCollab = useCallback((
    designId: string,
    user: { id: string; name: string; email: string },
    role: 'owner' | 'editor' | 'viewer',
  ) => {
    joinRoom(designId, user, role, {
      onUsersChange: (users) => {
        setCollabUsers(users);
        setConnected(true);
      },
      onCommentsChange: (newComments) => setComments(newComments),
      onCursorUpdate: (data) => {
        if (data.cursor) {
          cursorMapRef.current.set(data.socketId, data);
        } else {
          cursorMapRef.current.delete(data.socketId);
        }
        setCursors(Array.from(cursorMapRef.current.values()));
      },
      onYjsSync: () => { /* Yjs sync handled separately if needed */ },
      onYjsUpdate: () => { /* Yjs updates handled separately */ },
      onViewportUpdate: () => { /* Follow mode viewport updates */ },
    });
  }, []);

  /** Stop the collaboration session */
  const stopCollab = useCallback(() => {
    leaveRoom();
    setCollabUsers([]);
    setComments([]);
    setCursors([]);
    setConnected(false);
    cursorMapRef.current.clear();
  }, []);

  /** Send cursor position (call on mouse move over canvas) */
  const updateCursor = useCallback((x: number, y: number) => {
    if (!isConnected()) return;
    sendCursorMove({ x, y });
  }, []);

  /** Clear cursor (mouse leaves canvas) */
  const clearCursor = useCallback(() => {
    if (!isConnected()) return;
    sendCursorMove(null);
  }, []);

  /** Add a comment at a canvas position */
  const addComment = useCallback((x: number, y: number, text: string) => {
    if (!isConnected()) return;
    sendComment(x, y, text);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => { leaveRoom(); };
  }, []);

  return {
    collabUsers,
    comments,
    cursors,
    followingUserId,
    setFollowingUserId,
    commentsOpen,
    setCommentsOpen,
    connected,
    startCollab,
    stopCollab,
    updateCursor,
    clearCursor,
    addComment,
  };
}
