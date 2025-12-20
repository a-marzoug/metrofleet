"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { Database, Send, Square } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Markdown } from "@/components/markdown";
import { SqlBlock } from "@/components/sql-block";
import type { ToolOutput } from "@/types/database";

type ToolPart = {
  type: `tool-${string}`;
  toolCallId: string;
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error";
  input?: { query?: string };
  output?: ToolOutput;
  errorText?: string;
};

const ToolResult = ({ part }: { part: ToolPart }) => {
  const query = part.input?.query;

  // Still loading
  if (part.state === "input-streaming" || part.state === "input-available") {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400 py-2">
        <Database size={14} className="animate-pulse" />
        <span>Querying database...</span>
        {query && <SqlBlock query={query} />}
      </div>
    );
  }

  // Error state
  if (part.state === "output-error") {
    return (
      <div className="py-2">
        {query && <SqlBlock query={query} />}
        <div className="text-sm text-red-500">Error: {part.errorText}</div>
      </div>
    );
  }

  // Output available
  if (part.state === "output-available" && part.output) {
    if ("error" in part.output) {
      return (
        <div className="py-2">
          {query && <SqlBlock query={query} />}
          <div className="text-sm text-red-500">Error: {part.output.error}</div>
        </div>
      );
    }

    return (
      <div className="py-2">
        {query && <SqlBlock query={query} />}
        <DataTable data={part.output.data} />
        {part.output.note && (
          <div className="text-xs text-zinc-400 mt-2">{part.output.note}</div>
        )}
      </div>
    );
  }

  return null;
};

const MessageContent = ({
  message,
  isStreaming,
}: {
  message: UIMessage;
  isStreaming: boolean;
}) => {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-zinc-100 rounded-3xl px-5 py-2.5 max-w-[80%]">
          <p className="text-zinc-900">
            {message.parts.find((p) => p.type === "text")?.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {message.parts.map((part, idx) => {
        if (part.type === "text" && part.text) {
          return (
            <Markdown key={`${message.id}-${idx}`} isStreaming={isStreaming}>
              {part.text}
            </Markdown>
          );
        }

        if (part.type.startsWith("tool-")) {
          const toolPart = part as unknown as ToolPart;
          return (
            <ToolResult key={toolPart.toolCallId || idx} part={toolPart} />
          );
        }

        return null;
      })}
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-4">
    <h1 className="text-2xl font-medium text-zinc-800 mb-2">
      What would you like to analyze?
    </h1>
    <p className="text-zinc-500 max-w-md">
      Ask about revenue trends, trip patterns, weather impact, or any insights
      from the NYC taxi data.
    </p>
  </div>
);

const AnalystChat = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const isStreaming = status === "streaming" || status === "submitted";

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length, messages.at(-1)?.parts.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Minimal Header */}
      <header className="flex items-center justify-center py-3 border-b border-zinc-100">
        <span className="text-sm font-medium text-zinc-700">MetroAnalyst</span>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageContent
                    message={m}
                    isStreaming={isStreaming && m.id === messages.at(-1)?.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto relative flex items-end"
        >
          <div className="w-full relative flex items-center bg-zinc-100 rounded-3xl border border-zinc-200 focus-within:border-zinc-300 transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              rows={1}
              className="flex-1 bg-transparent px-5 py-3 text-base resize-none outline-none max-h-32 placeholder:text-zinc-400"
              style={{ minHeight: "48px" }}
            />
            <button
              type={isStreaming ? "button" : "submit"}
              onClick={isStreaming ? stop : undefined}
              className="m-2 p-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isStreaming && !input.trim()}
            >
              {isStreaming ? <Square size={16} /> : <Send size={16} />}
            </button>
          </div>
        </form>
        <p className="text-center text-xs text-zinc-400 mt-2">
          MetroAnalyst can make mistakes. Verify important data.
        </p>
      </div>
    </div>
  );
};

export default AnalystChat;
