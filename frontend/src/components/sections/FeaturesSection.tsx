"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";

const features = [
  {
    title: "Demand planning",
    description: "Plan crop volume, purchase timing, and replenishment decisions from one forecasting workflow."
  },
  {
    title: "Decision support",
    description: "Summarize weather, price, and market signals into practical next actions for each role."
  },
  {
    title: "Waste controls",
    description: "Track perishability, stock exposure, and movement timing before inventory loses value."
  },
  {
    title: "Buyer coordination",
    description: "Keep farmers, stores, and distribution teams aligned around the same supply signal."
  },
  {
    title: "Regional context",
    description: "Use region, category, and service-area details to make forecasts operationally relevant."
  },
  {
    title: "Weather context",
    description: "Bring weather forecasts into harvest and logistics planning where timing matters."
  },
];

export default function FeaturesSection() {
  return (
    <Section id="features" className="bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-16 max-w-3xl text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
          Capabilities
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
          Core workflows without the clutter
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Purpose-built screens for forecasting, inventory, procurement, sales, fleet, and warehouse operations.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-slate-300"
          >
            <h3 className="text-lg font-semibold text-slate-950">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
