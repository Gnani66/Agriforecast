"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { retailerService } from "@/services/retailerService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Which items should I reorder?",
  "What inventory has highest waste risk?",
  "Which products are selling fastest?",
  "What products should I reduce?",
  "Suggest procurement for next week",
  "What's my revenue projection?",
];

export default function RetailAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I am your Retail AI Assistant. I can help you with:\n\n" +
        "- Inventory management decisions\n" +
        "- Procurement recommendations\n" +
        "- Waste prevention strategies\n" +
        "- Sales predictions\n\n" +
        "What would you like to know about your store today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const res = await retailerService.chatWithAI(input);
    const response = res.success && res.data ? res.data.response : "Sorry, I couldn't process that request. Please try again.";

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleSuggested = (question: string) => {
    setInput(question);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-slate-100 rounded-lg"><Sparkles className="w-6 h-6 text-slate-500" /></div>
        <div><h1 className="text-2xl font-bold text-slate-800">Retail AI Assistant</h1><p className="text-slate-500">Your intelligent business advisor</p></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg"><Bot className="w-6 h-6 text-white" /></div>
            <div><h2 className="text-white font-semibold">Smart Retail Advisor</h2><div className="flex items-center gap-2"><span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" /><span className="text-slate-300 text-sm">Online - AI Powered</span></div></div>
          </div>
        </div>

        <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-slate-50">
          <AnimatePresence>
            {messages.map((message) => (
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === "user" ? "bg-slate-900" : "bg-slate-900"}`}>
                    {message.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`rounded-lg px-4 py-3 ${message.role === "user" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-800"}`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-slate-500"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Thinking...</span></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          {messages.length === 1 && (
            <div className="mb-4">
              <p className="text-sm text-slate-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button key={i} onClick={() => handleSuggested(q)} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors">{q}</button>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Ask about inventory, procurement, waste, or sales..." className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent text-sm" />
            <button onClick={handleSend} disabled={!input.trim()} className="px-6 py-3 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><Send className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
