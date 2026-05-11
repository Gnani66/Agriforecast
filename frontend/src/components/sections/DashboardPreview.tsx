"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const actions = [
  { label: "Farmer sign up", href: "/farmer/signup" },
  { label: "Retailer sign up", href: "/retailer/signup" },
  { label: "Distributor sign up", href: "/distributor/signup" },
];

export default function DashboardPreview() {
  return (
    <Section className="bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Get started</p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
          Start with the correct workspace
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Create the account type that matches your role in the supply chain.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3"
      >
        {actions.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {label}
            <ArrowRight size={16} />
          </Link>
        ))}
      </motion.div>
    </Section>
  );
}
