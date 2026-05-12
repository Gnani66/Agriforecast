"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";

const problems = [
  {
    title: "Perishable exposure",
    description: "Teams need earlier visibility into stock that may lose value before it is sold or moved."
  },
  {
    title: "Overstocking",
    description: "Without reliable demand signals, retailers carry unnecessary inventory and absorb avoidable loss."
  },
  {
    title: "Quality drift",
    description: "Harvest, storage, and transport decisions must be coordinated while freshness windows are still open."
  },
  {
    title: "Demand mismatch",
    description: "Farm output, store demand, and transport capacity often move on different schedules."
  },
  {
    title: "Fragmented operations",
    description: "Separate tools for each role make it harder to see the same risk at the same time."
  },
];

export default function ProblemSection() {
  return (
    <Section className="bg-slate-50">
      <div className="mb-12 max-w-3xl">
        <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          The operating problem
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
          Built for real operational pressure
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-5 text-lg leading-8 text-slate-600">
          Agricultural teams need software that respects timing, perishability, and role-specific decisions.
        </motion.p>
      </div>

      <div className="grid border-t border-slate-200 md:grid-cols-2 lg:grid-cols-5">
        {problems.map((problem, index) => (
          <motion.div key={problem.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="border-b border-slate-200 py-6 md:pr-6 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0">
            <h3 className="text-base font-semibold text-slate-950">{problem.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{problem.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
