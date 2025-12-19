"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { Bot, Database, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ToolOutput } from "@/types/database";

type ToolPart = {
  type: `tool-${string}`;
  toolCallId: string;
  toolName: string;
  state: "partial-call" | "call" | "result";
  result?: ToolOutput;
};

const ToolResult = ({ part }: { part: ToolPart }) => {
  if (part.state !== "result" || !part.result) {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400 animate-pulse">
        <Database size={12} />
        <span>Querying Database...</span>
      </div>
    );
  }

  if ("error" in part.result) {
    return (
      <div className="mt-2 text-xs text-red-500">
        Error: {part.result.error}
      </div>
    );
  }

  return (
    <Card className="p-2 bg-zinc-50 mt-2">
      <div className="text-xs text-zinc-500 mb-1 font-mono">SQL Result:</div>
      <DataTable data={part.result.data} />
      {part.result.note && (
        <div className="text-xs text-zinc-400 mt-1">{part.result.note}</div>
      )}
    </Card>
  );
};

type MessagePartProps = {
  part: UIMessage["parts"][number];
  messageId: string;
  index: number;
};

const MessagePart = ({ part, messageId, index }: MessagePartProps) => {
  if (part.type === "text") {
    return (
      <p key={`${messageId}-text-${index}`} className="whitespace-pre-wrap">
        {part.text}
      </p>
    );
  }

  if (part.type.startsWith("tool-")) {
    const toolPart = part as unknown as ToolPart;
    return <ToolResult key={toolPart.toolCallId} part={toolPart} />;
  }

  return null;
};

const MessageBubble = ({ message }: { message: UIMessage }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
          <Bot size={16} />
        </div>
      )}

      <div
        className={`rounded-2xl px-5 py-3 max-w-[85%] shadow-sm ${
          isUser
            ? "bg-zinc-900 text-white"
            : "bg-white border border-zinc-200 text-zinc-800"
        }`}
      >
        <div className="prose prose-sm dark:prose-invert">
          {message.parts.map((part, idx) => (
            <MessagePart
              key={`${message.id}-${idx}`}
              part={part}
              messageId={message.id}
              index={idx}
            />
          ))}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0">
          <User size={16} />
        </div>
      )}
    </div>
  );
};

const AnalystChat = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-3 shadow-sm">
        <div className="bg-yellow-500 p-2 rounded-lg text-white">
          <Database size={20} />
        </div>
        <div>
          <h1 className="font-bold text-lg text-zinc-900">MetroAnalyst AI</h1>
          <p className="text-xs text-zinc-500">
            Powered by Gemini & Vercel SDK
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden p-4">
        <ScrollArea className="h-full pr-4" ref={scrollRef}>
          <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-4">
            {messages.length === 0 && (
              <div className="text-center mt-20 text-zinc-400">
                <Bot size={48} className="mx-auto mb-4 opacity-50" />
                <p>Ask me about revenue, weather impact, or trip patterns.</p>
              </div>
            )}

            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {isLoading && messages.at(-1)?.role !== "assistant" && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl border text-sm text-zinc-500 italic">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 bg-white border-t">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto relative flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Show me the revenue trend for January 2025..."
            className="pr-12 py-6 text-base shadow-sm"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading}
            className="absolute right-2 top-1.5 h-9 w-9"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AnalystChat;
