"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AICard() {
  return (
    <div className="bg-slate-900 rounded-lg p-5 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-semibold">AI Insights</h3>
      </div>

      <p className="text-sm text-slate-400 mb-4">
        Ask your AI assistant for personalized recommendations on crop planning, harvest timing, and market opportunities.
      </p>

      <Link
        href="/farmer/assistant"
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/10 rounded-md text-sm font-medium hover:bg-white/20 transition-colors"
      >
        Ask AI Assistant
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
