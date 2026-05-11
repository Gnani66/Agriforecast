"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AICard() {
  return (
    <div className="bg-emerald-600 rounded-lg p-5 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5" />
        <h3 className="text-lg font-semibold">AI Insights</h3>
      </div>

      <p className="text-sm text-emerald-100 mb-4">
        Ask your AI assistant for personalized recommendations on crop planning, harvest timing, and market opportunities.
      </p>

      <Link
        href="/farmer/assistant"
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
      >
        Ask AI Assistant
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
