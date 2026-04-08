/**
 * AIAssistantPanel — conversational AI design partner.
 *
 * Chat-style interface where users type messages to Claude.
 * Each message includes conversation history + current design context.
 * Claude can respond with text, design modifications, batch designs,
 * or copy suggestions — all rendered inline in the chat.
 *
 * Quick-action chips (Feedback, Smart Edit, Translate, etc.) send
 * pre-written messages into the chat so responses appear in context.
 *
 * Supports image input: drag-drop or paste an image for Claude Vision
 * to analyze and recreate as a design.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { engine, onSelectionChange } from './Canvas';
import {
  isAIAssistantAvailable,
  chatWithClaude,
  LANGUAGES,
  type ChatMessage,
  type ChatResponse,
} from '../lib/ai-assistant';
import { saveApiKey, clearApiKey } from '../lib/ai-generate';
import type { SelectedObjectProps, DesignDocument } from '@monet/shared';

let nextId = 1;
function msgId(): string { return `msg-${nextId++}`; }

export function AIAssistantPanel() {
  const [connected, setConnected] = useState(isAIAssistantAvailable());
  const [keyInput, setKeyInput] = useState('');

  if (!connected) {
    return (
      <div className="flex w-64 flex-col border-r border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">AI Assistant</h3>
        <p className="mb-2 text-[10px] text-gray-500 dark:text-gray-400">
          Connect your Claude account to use the AI Design Assistant.
        </p>
        <input type="password" value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && keyInput.trim()) { saveApiKey(keyInput); setConnected(true); setKeyInput(''); } }}
          placeholder="sk-ant-..."
          className="mb-2 w-full rounded border border-gray-200 px-2 py-1.5 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" />
        <button type="button"
          onClick={() => { if (keyInput.trim()) { saveApiKey(keyInput); setConnected(true); setKeyInput(''); } }}
          disabled={!keyInput.trim()}
          className="w-full rounded bg-blue-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          Connect
        </button>
        <p className="mt-2 text-[9px] text-gray-400">Get a key at console.anthropic.com</p>
      </div>
    );
  }

  return <ChatView onDisconnect={() => { clearApiKey(); setConnected(false); }} />;
}

// ─── Chat View ────────────────────────────────────────────────────

interface ChatViewProps { onDisconnect: () => void }

function ChatView({ onDisconnect }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [translateLang, setTranslateLang] = useState('es');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Track text selection for "Suggest Copy" chip
  useEffect(() => {
    return onSelectionChange((props: SelectedObjectProps | null) => {
      setSelectedText(props?.objectType === 'textbox' ? props.text ?? null : null);
    });
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string, image?: string) => {
    if (!text.trim() && !image) return;

    const userMsg: ChatMessage = { id: msgId(), role: 'user', text: text.trim(), image };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setPendingImage(null);
    setLoading(true);

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
        text: `Error: ${err instanceof Error ? err.message : 'Something went wrong.'}`,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const handleResponse = useCallback(async (response: ChatResponse, originalDoc: DesignDocument) => {
    const assistantMsg: ChatMessage = { id: msgId(), role: 'assistant', text: response.reply };

    if (response.action === 'modify' && response.design) {
      engine.saveHistoryCheckpoint();
      await engine.fromJSON(response.design);
      assistantMsg.text += '\n\n(Design updated — Ctrl+Z to undo)';
    }

    if (response.action === 'batch' && response.designs) {
      // Generate thumbnails for batch designs
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
      // Restore original design
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

  // Handle image paste
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

  // Handle image drop
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
  const quickActions = [
    { label: 'Feedback', msg: 'Review my current design and give specific, actionable feedback on layout, color, typography, and hierarchy.' },
    { label: 'Smart Edit', msg: '' }, // placeholder — user types in input
    { label: 'Suggest Copy', msg: selectedText ? `Suggest 3 alternative text options for: "${selectedText}"` : '', disabled: !selectedText },
    { label: 'Translate', msg: `Translate all text in the design to ${LANGUAGES.find(l => l.code === translateLang)?.name || 'Spanish'}. Return the modified design.` },
    { label: 'Variations', msg: 'Generate 3 variations of my current design: one with a different color scheme, one with different fonts, and one with a different layout emphasis.' },
    { label: 'Batch Generate', msg: '' }, // placeholder
    { label: 'Extract Brand', msg: '' }, // needs image upload
  ];

  return (
    <div className="flex w-72 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2 dark:border-gray-800">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">AI Assistant</h3>
        <button type="button" onClick={onDisconnect}
          className="text-[9px] text-gray-400 hover:text-red-500">Disconnect</button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-xs text-gray-400">Ask me anything about your design.</p>
            <p className="mt-1 text-[10px] text-gray-300 dark:text-gray-600">
              I can give feedback, edit designs, generate variations, translate text, and more.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg}
            onApplyDesign={handleApplyDesign} onApplyCopy={handleApplyCopy} />
        ))}

        {loading && (
          <div className="flex items-center gap-1.5 px-2 py-1">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <span className="text-[10px] text-blue-500">Thinking...</span>
          </div>
        )}
      </div>

      {/* Quick-action chips */}
      <div className="border-t border-gray-100 px-2 py-1.5 dark:border-gray-800">
        <div className="flex flex-wrap gap-1">
          {quickActions.filter(a => a.msg || a.label === 'Smart Edit' || a.label === 'Batch Generate' || a.label === 'Extract Brand').map((action) => (
            <button key={action.label} type="button"
              disabled={loading || action.disabled}
              onClick={() => {
                if (action.label === 'Smart Edit') {
                  setInput('Make the following change: ');
                  inputRef.current?.focus();
                } else if (action.label === 'Batch Generate') {
                  setInput('Create 5 designs for: ');
                  inputRef.current?.focus();
                } else if (action.label === 'Extract Brand') {
                  setInput('Extract the brand identity from the attached image.');
                  inputRef.current?.focus();
                } else if (action.msg) {
                  sendMessage(action.msg);
                }
              }}
              className="rounded-full border border-gray-200 px-2 py-0.5 text-[9px] text-gray-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 dark:border-gray-700 dark:text-gray-400">
              {action.label}
            </button>
          ))}
          {/* Translate with inline language picker */}
          <select value={translateLang} onChange={(e) => setTranslateLang(e.target.value)}
            className="rounded-full border border-gray-200 px-1 py-0.5 text-[9px] text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            aria-label="Translation language">
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>
      </div>

      {/* Pending image preview */}
      {pendingImage && (
        <div className="relative border-t border-gray-100 px-2 py-1 dark:border-gray-800">
          <img src={pendingImage} alt="Attached" className="h-16 rounded object-cover" />
          <button type="button" onClick={() => setPendingImage(null)}
            className="absolute right-3 top-2 rounded bg-black/50 px-1 text-[10px] text-white">&times;</button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-2 dark:border-gray-700">
        <div className="flex gap-1">
          <textarea ref={inputRef} value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Ask about your design..."
            rows={2}
            className="flex-1 resize-none rounded border border-gray-200 px-2 py-1.5 text-xs focus:border-blue-400 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            disabled={loading} />
          <button type="button" onClick={() => sendMessage(input, pendingImage ?? undefined)}
            disabled={loading || (!input.trim() && !pendingImage)}
            className="shrink-0 self-end rounded bg-blue-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            Send
          </button>
        </div>
        <p className="mt-1 text-[9px] text-gray-400">
          Paste or drop images for vision analysis. Shift+Enter for newline.
        </p>
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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[90%] rounded-lg px-2.5 py-1.5 text-[11px] leading-relaxed ${
        isUser
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
      }`}>
        {/* User image attachment */}
        {message.image && isUser && (
          <img src={message.image} alt="Attached" className="mb-1 h-20 rounded object-cover" />
        )}

        {/* Message text */}
        {message.text.split('\n').map((line, i) => {
          if (!line.trim()) return <br key={i} />;
          if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={i} className="mt-1.5 font-semibold first:mt-0">{line.replace(/\*\*/g, '')}</p>;
          }
          if (line.startsWith('- ')) {
            return <p key={i} className="ml-2">{line}</p>;
          }
          return <p key={i}>{line}</p>;
        })}

        {/* Copy suggestions */}
        {message.copySuggestions && message.copySuggestions.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {message.copySuggestions.map((text, i) => (
              <button key={i} type="button" onClick={() => onApplyCopy(text)}
                className="rounded border border-gray-300 bg-white px-2 py-1 text-left text-[10px] text-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {text}
              </button>
            ))}
          </div>
        )}

        {/* Design thumbnails (batch generate) */}
        {message.designs && message.designs.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-1">
            {message.designs.map((d, i) => (
              <button key={i} type="button" onClick={() => onApplyDesign(d.document)}
                className="overflow-hidden rounded border border-gray-300 hover:border-blue-400 dark:border-gray-600">
                {d.thumbnail && <img src={d.thumbnail} alt={d.label} className="h-14 w-full object-cover" />}
                <p className="truncate px-1 py-0.5 text-[9px] text-gray-500 dark:text-gray-400">{d.label}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
