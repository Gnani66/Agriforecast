"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const portals = [
  {
    title: "Farmer",
    description: "Crop planning, market signals, weather context, and harvest guidance.",
    signin: "/farmer/login",
    signup: "/farmer/signup",
  },
  {
    title: "Retailer",
    description: "Inventory setup, sales visibility, procurement rules, and waste controls.",
    signin: "/retailer/login",
    signup: "/retailer/signup",
  },
  {
    title: "Distributor",
    description: "Fleet registration, shipment records, warehouse setup, and route planning.",
    signin: "/distributor/login",
    signup: "/distributor/signup",
  },
];

export default function PortalsSection() {
  return (
    <Section id="portals" className="bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-16 max-w-3xl text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
          Workspaces
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
          One platform, three operating views
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Each role gets a dedicated sign-in, sign-up, and protected application area without placeholder routes.
        </p>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        {portals.map((portal, index) => (
          <motion.div
            key={portal.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-slate-300"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
            <h3 className="mt-6 text-2xl font-semibold text-slate-950">{portal.title}</h3>
            <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{portal.description}</p>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link href={portal.signin} className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800">
                Sign in
                <ArrowRight size={15} />
              </Link>
              <Link href={portal.signup} className="inline-flex h-10 items-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition hover:border-slate-400">
                Create account
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
