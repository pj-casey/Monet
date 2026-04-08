/**
 * CursorOverlay — renders other users' cursors on top of the canvas.
 *
 * Each cursor is a colored arrow with the user's name label.
 * Positioned absolutely over the canvas container.
 */

interface RemoteCursor {
  socketId: string;
  userId: string;
  name: string;
  color: string;
  cursor: { x: number; y: number } | null;
}

interface CursorOverlayProps {
  cursors: RemoteCursor[];
}

export function CursorOverlay({ cursors }: CursorOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {cursors.map((c) => {
        if (!c.cursor) return null;
        return (
          <div
            key={c.socketId}
            className="absolute transition-transform duration-75"
            style={{ transform: `translate(${c.cursor.x}px, ${c.cursor.y}px)` }}
          >
            {/* Cursor arrow */}
            <svg width="16" height="20" viewBox="0 0 16 20" fill={c.color} className="drop-shadow-sm">
              <path d="M0 0l16 12-7 0-4 8z" />
            </svg>
            {/* Name label */}
            <span
              className="ml-3 -mt-1 inline-block whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: c.color }}
            >
              {c.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export type { RemoteCursor };
