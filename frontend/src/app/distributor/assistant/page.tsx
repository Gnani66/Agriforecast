"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Which routes have highest delay risk?",
  "How can fuel efficiency improve?",
  "Which warehouse is overloaded?",
  "What shipments are delayed?",
  "Suggest fleet optimization",
  "Weather impact on deliveries?",
];

const generateResponse = (question: string): string => {
  const q = question.toLowerCase();

  if (q.includes("delay") || q.includes("risk")) {
    return "Route Delay Risk Analysis:\n\nHIGH RISK ROUTES:\n1. Nashik-Nagpur - 78% on-time rate (heavy traffic plus road conditions)\n2. Mumbai-Thane - 82% on-time rate (metro construction)\n3. Pune-Aurangabad - 85% on-time rate (weather dependent)\n\nMODERATE RISK:\n- Mumbai-Pune Express - 90% on-time rate\n\nRecommendation: Pre-alert customers on high-risk routes and consider buffer time in ETAs.";
  }

  if (q.includes("fuel") || q.includes("efficiency") || q.includes("save")) {
    return "Fuel Efficiency Recommendations:\n\nCurrent Performance:\n- Average: 10.5 km/l\n- Best: 12.1 km/l (vehicle MH12 KL 2468)\n- Worst: 8.5 km/l (vehicle VH004)\n\nOptimization Tips:\n1. Route Optimization: Use Pune-Aurangabad model for other routes\n2. Vehicle Maintenance: VH004 showing poor efficiency - needs service\n3. Driver Training: Implement eco-driving practices\n4. Load Optimization: Combine shipments to reduce trips\n\nPotential Savings: 8-12% reduction in fuel costs";
  }

  if (q.includes("warehouse") || q.includes("overload") || q.includes("capacity")) {
    return "Warehouse Capacity Analysis:\n\nCRITICAL:\n- Mumbai Depot: 92% utilized - approaching maximum capacity\n  Action: Redirect shipments to Pune or Nashik\n\nWARNING:\n- Pune Central: 78% utilized - manageable\n- Nashik Center: 65% utilized - good capacity\n- Nagpur Station: 45% utilized - underutilized\n\nAI Suggestion: Use Nagpur more for Northern region shipments to balance load.";
  }

  if (q.includes("delayed") || q.includes("delay") || q.includes("shipment")) {
    return "Current Delay Status:\n\nDelayed Shipments:\n1. SHP002 - Nashik to Nagpur (plus 2h 30m)\n   Reason: Heavy traffic on Highway\n   Risk: High\n\n2. SHP008 - Pimpri to Alandi (plus 3h 00m)\n   Reason: Route congestion\n   Risk: High\n\nRoot Cause Analysis:\n- 62% traffic-related\n- 25% weather-related\n- 13% operational\n\nAction: Notify affected customers and adjust ETAs.";
  }

  if (q.includes("fleet") || q.includes("vehicle") || q.includes("optimize")) {
    return "Fleet Optimization Plan:\n\nCurrent Fleet: 6 vehicles\n- Active: 4\n- Idle: 1\n- Maintenance: 1\n\nRecommendations:\n\n1. Reassign VH003 (Idle): Deploy to high-demand Pune-Aurangabad route\n\n2. Service Priority: VH004 needs immediate attention - scheduling maintenance\n\n3. Route Matching:\n   - Long haul (Nashik-Nagpur): Assign Ashok Leyland (VH003)\n   - Urban delivery (Mumbai-Thane): Assign Mahindra Supro (VH006)\n\n4. Fuel Management:\n   - VH002 at 45% - Refuel at next depot\n   - VH004 at 30% - Refuel after maintenance\n\nEstimated Improvement: 15% increase in delivery capacity";
  }

  if (q.includes("weather") || q.includes("rain") || q.includes("impact")) {
    return "Weather Impact Assessment:\n\nCurrent Conditions:\n- Mumbai Region: Moderate rain expected\n- Pune Region: Light showers\n- Northern Routes: Clear\n\nRoute Impacts:\n- Mumbai-Pune: plus 15 min delay expected\n- Nashik-Nagpur: Minor impact\n- Pune-Aurangabad: No significant impact\n\nRecommendations:\n1. Pre-position vehicles in Northern routes\n2. Alert customers on coastal routes\n3. Monitor road conditions in real-time\n\nBusiness Impact: 8-10% increase in delivery times for affected routes.";
  }

  return "I can help you with route optimization, fleet management, warehouse capacity, shipment tracking, and weather impact analysis. Try asking:\n\n- Which routes have highest delay risk?\n- How can fuel efficiency improve?\n- Which warehouse is overloaded?\n- What shipments are delayed?";
};

export default function DistributorAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello. I am your Logistics AI Assistant. I can help you with:\n\n- Route optimization and delay prediction\n- Fleet efficiency and maintenance\n- Warehouse capacity management\n- Shipment tracking and delays\n- Weather impact analysis\n\nHow can I optimize your logistics today?",
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

    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Distributor AI Assistant</h1>
        <p className="text-slate-500">Ask questions about routes, fleet, warehouses, and shipments</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Logistics Intelligence Advisor</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                <span className="text-blue-100 text-sm">Online - Ready to help</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-slate-50">
          <AnimatePresence>
            {messages.map((message) => (
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user" ? "bg-slate-900" : "bg-slate-700"
                  }`}>
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Analyzing...</span>
                </div>
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
                  <button key={i} onClick={() => setInput(q)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about routes, fleet, warehouses, or shipments..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent text-sm" />
            <button onClick={handleSend} disabled={!input.trim()}
              className="px-6 py-3 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
