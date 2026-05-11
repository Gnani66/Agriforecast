"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const workflowSteps = [
  {
    title: "Create a workspace",
    description: "Choose farmer, retailer, or distributor access and capture the operational details for that role."
  },
  {
    title: "Capture signals",
    description: "Use crop, inventory, weather, sales, shipment, and warehouse context as planning inputs."
  },
  {
    title: "Review forecasts",
    description: "Turn signals into demand, pricing, replenishment, and delivery planning views."
  },
  {
    title: "Prioritize actions",
    description: "Surface the decisions that need attention before waste, shortage, or delay becomes expensive."
  },
  {
    title: "Coordinate handoffs",
    description: "Keep producers, stores, and logistics teams aligned through the movement of perishables."
  },
  {
    title: "Monitor outcomes",
    description: "Track operational dashboards for inventory, sales, fleet utilization, and route performance."
  },
];

export default function WorkflowSection() {
  return (
    <Section id="workflow" className="bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-16 max-w-3xl text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Workflow
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
          From signal to action
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          A role-based flow that keeps the public site simple and the application screens focused.
        </p>
      </motion.div>

      <div className="mx-auto max-w-4xl">
        {workflowSteps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="grid border-t border-slate-200 py-6 md:grid-cols-[120px_1fr]"
          >
            <p className="text-sm font-semibold text-slate-400">{String(index + 1).padStart(2, "0")}</p>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mx-auto mt-12 max-w-4xl rounded-lg bg-slate-950 p-8 text-center text-white md:p-10"
      >
        <h3 className="mb-2 text-2xl font-semibold md:text-3xl">Open the workspace that matches your role</h3>
        <p className="mb-6 text-slate-300">Every portal has its own authentication flow and operational dashboard.</p>
        <Link href="#portals" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-slate-100">
          View portals
          <ArrowRight size={18} />
        </Link>
      </motion.div>
    </Section>
  );
}
