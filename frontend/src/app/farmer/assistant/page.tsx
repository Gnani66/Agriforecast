"use client";

import { useState, useRef, useEffect } from "react";
import FarmerLayout from "@/layouts/FarmerLayout";
import { farmerService } from "@/services/farmerService";
import { Bot, Send, MessageCircle } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "I am your AI farming assistant. I can help with crop recommendations, harvest timing, weather alerts, market prices, and more. How can I help you today?",
    timestamp: new Date()
  }
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const context = { history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })) };
      const res = await farmerService.chatWithAI(input, context);
      const aiResponse: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: res.data?.response || "I'm sorry, I couldn't process your request. Please try again.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch {
      const aiResponse: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "I'm having trouble connecting. Please check your connection and try again.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FarmerLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
          <p className="text-slate-500 mt-1">Get instant answers to your farming questions</p>
        </div>

        <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%]`}>
                  <div className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "assistant" ? "bg-slate-900" : "bg-slate-200"
                    }`}>
                      {msg.role === "assistant" ? (
                        <Bot className="w-4 h-4 text-white" />
                      ) : (
                        <MessageCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className={`rounded-lg p-4 ${
                      msg.role === "user"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}>
                      <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                      <p className={`text-xs mt-2 ${msg.role === "user" ? "text-emerald-200" : "text-slate-400"}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-lg p-4">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question about your farm..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 py-3 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
