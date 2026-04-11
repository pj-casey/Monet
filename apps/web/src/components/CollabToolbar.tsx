/**
 * CollabToolbar — shows collaboration status, user avatars, and invite controls.
 *
 * Displayed in the toolbar when a collab session is active.
 * Shows: connected user avatars (color-coded), follow button, invite button.
 */

import { useState } from 'react';
import type { CollabUser } from '../lib/collab-client';
import { getInviteLink } from '../lib/collab-client';

interface CollabToolbarProps {
  users: CollabUser[];
  designId: string;
  isConnected: boolean;
  followingUserId: string | null;
  onFollow: (userId: string | null) => void;
}

export function CollabToolbar({ users, designId, isConnected, followingUserId, onFollow }: CollabToolbarProps) {
  const [showInvite, setShowInvite] = useState(false);

  if (!isConnected) return null;

  return (
    <div className="flex items-center gap-1">
      {/* User avatars */}
      <div className="flex -space-x-1.5">
        {users.slice(0, 5).map((user) => (
          <button
            key={user.id}
            type="button"
            title={`${user.name} (${user.role})`}
            onClick={() => onFollow(followingUserId === user.id ? null : user.id)}
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface text-[9px] font-semibold text-accent-fg ${
              followingUserId === user.id ? 'ring-2 ring-accent' : ''
            }`}
            style={{ backgroundColor: user.color }}
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
        ))}
        {users.length > 5 && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-text-tertiary text-[9px] font-semibold text-accent-fg">
            +{users.length - 5}
          </span>
        )}
      </div>

      {/* Invite button */}
      <div className="relative">
        <button type="button" onClick={() => setShowInvite(!showInvite)}
          className="rounded-md border border-border-strong px-2 py-0.5 text-[10px] text-text-secondary hover:bg-wash">
          Invite
        </button>
        {showInvite && (
          <div className="absolute right-0 top-full z-40 mt-1 w-64 rounded-lg border border-border bg-surface p-3 shadow-lg">
            <p className="mb-2 text-xs font-medium text-text-secondary">Share invite link:</p>
            <InviteLinkRow label="Editor" link={getInviteLink(designId, 'editor')} />
            <InviteLinkRow label="Viewer" link={getInviteLink(designId, 'viewer')} />
            <button type="button" onClick={() => setShowInvite(false)}
              className="mt-2 text-[10px] text-text-tertiary hover:underline">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

function InviteLinkRow({ label, link }: { label: string; link: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mb-1 flex items-center gap-1">
      <span className="w-12 text-[10px] text-text-tertiary">{label}:</span>
      <input type="text" readOnly value={link}
        className="flex-1 rounded border border-border bg-canvas px-1.5 py-0.5 text-[9px]" />
      <button type="button" onClick={handleCopy}
        className="rounded bg-accent px-1.5 py-0.5 text-[9px] text-accent-fg hover:bg-accent-hover">
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
