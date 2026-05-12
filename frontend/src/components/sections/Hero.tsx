"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const rows = [
  { role: "Farmer", signal: "Harvest window", status: "Ready for review" },
  { role: "Retailer", signal: "Stock exposure", status: "Needs data" },
  { role: "Distributor", signal: "Route capacity", status: "Needs data" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f7f8fa] pt-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-16 sm:px-6 md:pb-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700"
          >
            Agricultural operations platform
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-6 max-w-4xl text-[3.25rem] font-semibold leading-[0.98] text-slate-950 sm:text-[4.5rem] lg:text-[5.35rem]"
          >
            Plan supply before it becomes loss.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-7 max-w-2xl text-lg leading-8 text-slate-600"
          >
            AgriForecast gives farmers, retailers, and distributors a shared operating layer for demand planning, perishable inventory, and supply movement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link href="/farmer/signup" className="inline-flex h-11 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Start with farmer workspace
              <ArrowRight size={16} />
            </Link>
            <Link href="#portals" className="inline-flex h-11 items-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-slate-400">
              View all workspaces
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="self-end rounded-lg border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-950">Operational readiness</h2>
            </div>
            <span className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">Today</span>
          </div>

          <div className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Signal</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.role} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-medium text-slate-950">{row.role}</td>
                    <td className="px-5 py-4 text-slate-600">{row.signal}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid border-t border-slate-200 md:grid-cols-3">
            {["Forecast demand", "Control waste", "Move supply"].map((item) => (
              <div key={item} className="border-t border-slate-200 px-5 py-4 md:border-l md:border-t-0 first:md:border-l-0">
                <p className="text-sm font-semibold text-slate-950">{item}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Role-aware workflow</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-px px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {["Demand forecasting", "Retail inventory", "Distribution planning"].map((item) => (
            <div key={item} className="py-4 text-sm font-medium text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
