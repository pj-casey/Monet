/**
 * CommentsPanel — shows and manages canvas comments.
 *
 * Comments are positioned at specific canvas coordinates.
 * Each comment can have threaded replies and be resolved/unresolved.
 */

import { useState, useCallback } from 'react';
import type { CollabComment } from '../lib/collab-client';
import { replyToComment, resolveComment } from '../lib/collab-client';

interface CommentsPanelProps {
  comments: CollabComment[];
  isOpen: boolean;
  onClose: () => void;
}

export function CommentsPanel({ comments, isOpen, onClose }: CommentsPanelProps) {
  if (!isOpen) return null;

  const unresolved = comments.filter((c) => !c.resolved);
  const resolved = comments.filter((c) => c.resolved);

  return (
    <div className="absolute right-0 top-0 z-30 flex h-full w-72 flex-col border-l border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Comments ({comments.length})
        </h3>
        <button type="button" onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">&#x2715;</button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {comments.length === 0 && (
          <p className="text-center text-xs text-gray-400">No comments yet. Click on the canvas to add one.</p>
        )}

        {unresolved.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500">Open</p>
            {unresolved.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}

        {resolved.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500">Resolved</p>
            {resolved.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CommentCard({ comment }: { comment: CollabComment }) {
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState(false);

  const handleReply = useCallback(() => {
    if (!replyText.trim()) return;
    replyToComment(comment.id, replyText.trim());
    setReplyText('');
    setShowReply(false);
  }, [comment.id, replyText]);

  const formatTime = (iso: string) => {
    try { return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return ''; }
  };

  return (
    <div className={`mb-2 rounded-lg border p-2.5 ${
      comment.resolved
        ? 'border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50'
        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{comment.userName}</span>
        <span className="text-[9px] text-gray-400">{formatTime(comment.createdAt)}</span>
      </div>
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{comment.text}</p>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-2 border-l-2 border-gray-200 pl-2 dark:border-gray-700">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="mb-1">
              <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">{reply.userName}</span>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{reply.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-2 flex items-center gap-2">
        <button type="button" onClick={() => resolveComment(comment.id)}
          className="text-[10px] text-blue-500 hover:underline">
          {comment.resolved ? 'Unresolve' : 'Resolve'}
        </button>
        <button type="button" onClick={() => setShowReply(!showReply)}
          className="text-[10px] text-gray-400 hover:underline">Reply</button>
      </div>

      {showReply && (
        <div className="mt-1.5 flex gap-1">
          <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleReply(); }}
            placeholder="Reply..."
            className="flex-1 rounded border border-gray-200 px-2 py-0.5 text-[10px] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            autoFocus />
          <button type="button" onClick={handleReply}
            className="rounded bg-blue-600 px-1.5 py-0.5 text-[9px] text-white">Send</button>
        </div>
      )}
    </div>
  );
}
