/**
 * AIAssistantPanel — conversational AI design partner with streaming.
 *
 * Features:
 * - User messages right-aligned, Claude messages left-aligned with avatar
 * - Streaming: feedback text appears word-by-word as it arrives
 * - Animated typing indicator while waiting for JSON responses
 * - Quick-action chips (Get feedback, Suggest copy, Smart edit, Translate)
 * - Image paste/drop for Claude Vision
 * - Cost estimation before send, actual usage after response
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { engine, onSelectionChange } from './Canvas';
import {
  isAIConfigured,
  chatWithClaude,
  getDesignFeedback,
  LANGUAGES,
  formatUsage,
  type ChatMessage,
  type ChatResponse,
} from '../lib/ai-assistant';
import { saveApiKey, clearApiKey } from '../lib/ai-generate';
import { estimateCallCost } from '../lib/token-estimator';
import { useActivityStore } from '../stores/activity-store';
import type { SelectedObjectProps, DesignDocument } from '@monet/shared';

let nextId = 1;
function msgId(): string { return `msg-${nextId++}`; }

export function AIAssistantPanel({ onOpenSettings }: { onOpenSettings?: () => void } = {}) {
  const [connected, setConnected] = useState(isAIConfigured());
  const [keyInput, setKeyInput] = useState('');

  // Re-check connection when settings are saved
  useEffect(() => {
    const handler = () => setConnected(isAIConfigured());
    window.addEventListener('monet-settings-changed', handler);
    return () => window.removeEventListener('monet-settings-changed', handler);
  }, []);

  if (!connected) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-subtle">
          <SparkleIcon className="h-7 w-7 text-accent" />
        </div>
        <h3 className="mb-1 text-sm font-semibold text-text-primary">AI Design Assistant</h3>
        <p className="mb-5 text-xs text-text-tertiary">
          Get feedback, edit designs, generate copy, and more with Claude.
        </p>
        <input type="password" value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && keyInput.trim()) { saveApiKey(keyInput); setConnected(true); setKeyInput(''); } }}
          placeholder="Paste your API key (sk-ant-...)"
          className="mb-3 w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-xs placeholder:text-text-tertiary focus:border-accent focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent/30" />
        <button type="button"
          onClick={() => { if (keyInput.trim()) { saveApiKey(keyInput); setConnected(true); setKeyInput(''); } }}
          disabled={!keyInput.trim()}
          className="mb-2 w-full rounded-lg bg-accent px-4 py-2.5 text-xs font-medium text-accent-fg shadow-sm hover:bg-accent-hover disabled:opacity-40">
          Connect Claude
        </button>
        {onOpenSettings && (
          <button type="button" onClick={onOpenSettings}
            className="w-full rounded-lg border border-border px-4 py-2 text-xs font-medium text-text-secondary hover:bg-wash">
            Open Settings
          </button>
        )}
        <p className="mt-3 text-[10px] text-text-tertiary">
          Get a key at <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">console.anthropic.com</a>
        </p>
      </div>
    );
  }

  return <ChatView onDisconnect={() => { clearApiKey(); setConnected(false); }} />;
}

// ─── Chat View ────────────────────────────────────────────────────

interface ChatViewProps { onDisconnect: () => void }

/** Regex to detect feedback requests */
const FEEDBACK_RE = /\b(review|feedback|critique|analyze|check|look at|what do you think|how does|thoughts on|opinion on|improve|suggestions?|rate|is this good|any tips)\b/i;

function ChatView({ onDisconnect }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const setActivity = useActivityStore((s) => s.setActivity);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [translateLang, setTranslateLang] = useState('es');
  const [costEstimate, setCostEstimate] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Track text selection for "Suggest Copy" chip
  useEffect(() => {
    return onSelectionChange((props: SelectedObjectProps | null) => {
      setSelectedText(props?.objectType === 'textbox' ? props.text ?? null : null);
    });
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, streaming]);

  // Update cost estimate as user types
  useEffect(() => {
    if (!input.trim()) {
      setCostEstimate('');
      return;
    }
    const est = estimateCallCost('', input, 800);
    setCostEstimate(est);
  }, [input]);

  const sendMessage = useCallback(async (text: string, image?: string) => {
    if (!text.trim() && !image) return;

    const userMsg: ChatMessage = { id: msgId(), role: 'user', text: text.trim(), image };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setPendingImage(null);
    setCostEstimate('');

    // Detect if this is a feedback request — use streaming feedback flow
    const isFeedbackRequest = FEEDBACK_RE.test(text) || text.includes('give specific, actionable feedback');

    if (isFeedbackRequest && !image) {
      await handleStreamingFeedback(userMsg);
    } else {
      await handleChatMessage(userMsg, text, image);
    }
  }, [messages]);

  /** Streaming feedback — text appears word-by-word */
  const handleStreamingFeedback = useCallback(async (_userMsg: ChatMessage) => {
    setStreaming(true);
    setActivity('processing');
    const assistantMsgId = msgId();

    // Add empty assistant message that we'll fill via streaming
    setMessages((prev) => [...prev, { id: assistantMsgId, role: 'assistant', text: '' }]);

    try {
      let screenshot: string | undefined;
      try { screenshot = engine.getArtboardDataURL(0.5); } catch { /* ignore */ }
      if (!screenshot) {
        setMessages((prev) => prev.map((m) =>
          m.id === assistantMsgId ? { ...m, text: 'No design on canvas to review.' } : m,
        ));
        return;
      }

      const result = await getDesignFeedback(screenshot, (delta) => {
        // Update the assistant message text with each streamed chunk
        setMessages((prev) => prev.map((m) =>
          m.id === assistantMsgId ? { ...m, text: m.text + delta } : m,
        ));
      });

      // Add usage info after streaming completes
      const usage = formatUsage(result.inputTokens, result.outputTokens);
      setMessages((prev) => prev.map((m) =>
        m.id === assistantMsgId ? { ...m, usage } : m,
      ));
    } catch (err) {
      setMessages((prev) => prev.map((m) =>
        m.id === assistantMsgId
          ? { ...m, text: `Something went wrong: ${err instanceof Error ? err.message : 'Unknown error'}` }
          : m,
      ));
    } finally {
      setStreaming(false);
      setActivity('idle');
    }
  }, [setActivity]);

  /** Standard chat message — JSON response collected and parsed */
  const handleChatMessage = useCallback(async (userMsg: ChatMessage, text: string, image?: string) => {
    setLoading(true);
    setActivity('processing');

    try {
      const currentDoc = engine.toJSON();

      // Attach screenshot if message references visual elements
      const needsScreenshot = !image && /look|see|current|this|design|layout|color|font|what do you think/i.test(text);
      let screenshotImage = image;
      if (needsScreenshot) {
        try { screenshotImage = engine.getArtboardDataURL(0.5); } catch { /* ignore */ }
      }

      const response = await chatWithClaude(
        [...messages, userMsg],
        currentDoc,
        text.trim(),
        screenshotImage,
      );

      await handleResponse(response, currentDoc);
    } catch (err) {
      const errMsg: ChatMessage = {
        id: msgId(), role: 'assistant',
        text: `Something went wrong: ${err instanceof Error ? err.message : 'Unknown error'}`,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setActivity('idle');
    }
  }, [messages, setActivity]);

  const handleResponse = useCallback(async (response: ChatResponse, originalDoc: DesignDocument) => {
    const usage = formatUsage(response.inputTokens, response.outputTokens);
    const assistantMsg: ChatMessage = { id: msgId(), role: 'assistant', text: response.reply, usage, rawResponse: response.rawResponse };

    if (response.action === 'modify' && response.design) {
      engine.saveHistoryCheckpoint();
      await engine.fromJSON(response.design);
      assistantMsg.text += '\n\n(Design updated — Ctrl+Z to undo)';
    }

    if (response.action === 'batch' && response.designs) {
      const designs: ChatMessage['designs'] = [];
      for (const d of response.designs) {
        try {
          await engine.fromJSON(d.document);
          const thumb = engine.getArtboardDataURL(0.15);
          designs.push({ label: d.label, document: d.document, thumbnail: thumb });
        } catch {
          designs.push({ label: d.label, document: d.document });
        }
      }
      await engine.fromJSON(originalDoc);
      assistantMsg.designs = designs;
    }

    if (response.action === 'suggest_copy' && response.suggestions) {
      assistantMsg.copySuggestions = response.suggestions;
    }

    setMessages((prev) => [...prev, assistantMsg]);
  }, []);

  const handleApplyDesign = useCallback(async (doc: DesignDocument) => {
    engine.saveHistoryCheckpoint();
    await engine.fromJSON(doc);
  }, []);

  const handleApplyCopy = useCallback((text: string) => {
    engine.updateSelectedTextProps({ text });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input, pendingImage ?? undefined);
    }
  }, [input, pendingImage, sendMessage]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => setPendingImage(reader.result as string);
          reader.readAsDataURL(file);
          e.preventDefault();
        }
      }
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPendingImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  // Quick-action chips
  const quickChips = [
    { label: 'Get feedback', icon: '💬', msg: 'Review my current design and give specific, actionable feedback on layout, color, typography, and hierarchy.' },
    { label: 'Suggest copy', icon: '✏️', msg: selectedText ? `Suggest 3 alternative text options for: "${selectedText}"` : '', disabled: !selectedText },
    { label: 'Smart edit', icon: '✨', msg: '', placeholder: true },
    { label: 'Translate', icon: '🌐', msg: `Translate all text in the design to ${LANGUAGES.find(l => l.code === translateLang)?.name || 'Spanish'}. Return the modified design.` },
  ];

  const isDisabled = loading || streaming;

  return (
    <div className="flex h-full flex-col"
      onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-subtle">
            <SparkleIcon className="h-3.5 w-3.5 text-accent" />
          </div>
          <span className="text-xs font-semibold text-text-primary">Claude</span>
        </div>
        <button type="button" onClick={onDisconnect}
          className="rounded-md px-2 py-1 text-[10px] text-text-tertiary hover:bg-wash hover:text-text-secondary">
          Disconnect
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-subtle">
              <SparkleIcon className="h-6 w-6 text-accent" />
            </div>
            <p className="text-sm font-medium text-text-secondary">How can I help?</p>
            <p className="mt-1 max-w-[200px] text-[11px] text-text-tertiary">
              Ask about your design, get feedback, or try the quick actions below.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg}
              onApplyDesign={handleApplyDesign} onApplyCopy={handleApplyCopy} />
          ))}

          {/* Typing indicator — shown while collecting JSON responses */}
          {loading && (
            <div className="flex items-start gap-2">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-subtle">
                <SparkleIcon className="h-3 w-3 text-accent" />
              </div>
              <div className="rounded-2xl rounded-tl-md bg-wash px-4 py-2.5">
                <div className="flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary [animation-delay:0ms]" />
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary [animation-delay:150ms]" />
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Streaming indicator — shown while feedback text is being received */}
          {streaming && (
            <div className="flex items-center gap-1.5 px-8 text-[10px] text-text-tertiary">
              <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-accent" />
              Streaming response...
            </div>
          )}
        </div>
      </div>

      {/* Quick-action chips */}
      <div className="border-t border-border px-3 py-2.5">
        <div className="flex flex-wrap gap-1.5">
          {quickChips.map((chip) => (
            <button key={chip.label} type="button"
              disabled={isDisabled || chip.disabled}
              onClick={() => {
                if (chip.placeholder) {
                  setInput('Make the following change: ');
                  inputRef.current?.focus();
                } else if (chip.msg) {
                  sendMessage(chip.msg);
                }
              }}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[10px] font-medium text-text-secondary hover:border-accent hover:text-accent disabled:opacity-30">
              <span>{chip.icon}</span>
              {chip.label}
            </button>
          ))}
          {/* Translate language picker */}
          <select value={translateLang} onChange={(e) => setTranslateLang(e.target.value)}
            className="rounded-lg border border-border px-2 py-1.5 text-[10px] text-text-secondary"
            aria-label="Translation language">
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>
      </div>

      {/* Pending image preview */}
      {pendingImage && (
        <div className="relative border-t border-border px-3 py-2">
          <img src={pendingImage} alt="Attached" className="h-16 rounded-lg object-cover" />
          <button type="button" onClick={() => setPendingImage(null)}
            className="absolute right-4 top-3 rounded-full bg-black/50 p-0.5 text-[10px] text-white hover:bg-black/70">&times;</button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <textarea ref={inputRef} value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Ask about your design..."
            rows={2}
            className="flex-1 resize-none rounded-lg border border-border bg-canvas px-3 py-2 text-xs placeholder:text-text-tertiary focus:border-accent focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent/30"
            disabled={isDisabled} />
          <div className="flex flex-col items-end gap-1 self-end">
            <button type="button" onClick={() => sendMessage(input, pendingImage ?? undefined)}
              disabled={isDisabled || (!input.trim() && !pendingImage)}
              className="shrink-0 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-fg shadow-sm hover:bg-accent-hover disabled:opacity-40">
              <SendIcon />
            </button>
            {/* Cost estimate */}
            {costEstimate && (
              <span className="text-[10px] text-text-tertiary">{costEstimate}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ──────────────────────────────────────────────

function MessageBubble({ message, onApplyDesign, onApplyCopy }: {
  message: ChatMessage;
  onApplyDesign: (doc: DesignDocument) => void;
  onApplyCopy: (text: string) => void;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-subtle">
          <SparkleIcon className="h-3 w-3 text-accent" />
        </div>
      )}

      <div className={`max-w-[85%] text-[11px] leading-relaxed ${
        isUser
          ? 'rounded-2xl rounded-tr-md bg-accent px-3.5 py-2.5 text-accent-fg'
          : 'rounded-2xl rounded-tl-md bg-wash px-3.5 py-2.5 text-text-primary'
      }`}>
        {/* User image attachment */}
        {message.image && isUser && (
          <img src={message.image} alt="Attached" className="mb-2 max-h-24 rounded-lg object-cover" />
        )}

        {/* Message text with basic formatting */}
        {message.text.split('\n').map((line, i) => {
          if (!line.trim()) return <br key={i} />;
          if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={i} className="mt-2 font-semibold first:mt-0">{line.replace(/\*\*/g, '')}</p>;
          }
          if (line.startsWith('- ')) {
            return <p key={i} className="ml-2">{line}</p>;
          }
          return <p key={i}>{line}</p>;
        })}

        {/* Copy suggestions */}
        {message.copySuggestions && message.copySuggestions.length > 0 && (
          <div className="mt-3 flex flex-col gap-1.5">
            {message.copySuggestions.map((text, i) => (
              <button key={i} type="button" onClick={() => onApplyCopy(text)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-left text-[10px] text-text-secondary hover:border-accent hover:bg-accent-subtle">
                {text}
              </button>
            ))}
          </div>
        )}

        {/* Design thumbnails (batch generate) */}
        {message.designs && message.designs.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {message.designs.map((d, i) => (
              <button key={i} type="button" onClick={() => onApplyDesign(d.document)}
                className="overflow-hidden rounded-lg border border-border hover:border-accent">
                {d.thumbnail && <img src={d.thumbnail} alt={d.label} className="h-16 w-full object-cover" />}
                <p className="truncate px-2 py-1 text-[9px] text-text-secondary">{d.label}</p>
              </button>
            ))}
          </div>
        )}

        {/* Token usage — shown after response */}
        {message.usage && !isUser && (
          <p className="mt-2 text-[9px] text-text-tertiary">{message.usage}</p>
        )}
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 2l1.5 4.5L15 8l-4.5 1.5L9 14l-1.5-4.5L3 8l4.5-1.5z" />
      <path d="M14 2l.5 1.5L16 4l-1.5.5L14 6l-.5-1.5L12 4l1.5-.5z" opacity="0.5" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2L7 9M14 2l-4 12-3-5-5-3z" />
    </svg>
  );
}
