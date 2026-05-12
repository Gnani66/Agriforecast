import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { BarChart3, Boxes, ShieldCheck, Truck } from "lucide-react";

const principles = [
  {
    icon: ShieldCheck,
    title: "Operational trust",
    description: "Clear role boundaries, protected workspaces, and predictable flows for daily agricultural operations.",
  },
  {
    icon: BarChart3,
    title: "Decision clarity",
    description: "Forecasting and analytics screens are designed to surface what needs action, not decorate the dashboard.",
  },
  {
    icon: Boxes,
    title: "Perishable control",
    description: "Inventory, harvest, sales, and storage views keep freshness windows visible across the workflow.",
  },
  {
    icon: Truck,
    title: "Supply movement",
    description: "Distributor tools focus on shipments, fleet, warehouse utilization, and route performance.",
  },
];

export default function About() {
  return (
    <>
      <Navbar />
      <main>
        <Section className="bg-white pt-32 pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-slate-50 px-4 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-emerald-200">
              About AgriForecast
            </span>
            <h1 className="mb-6 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Serious software for agricultural supply-chain decisions
            </h1>
            <p className="text-lg leading-8 text-slate-600">
              AgriForecast brings farmer planning, retailer inventory, and distributor logistics into connected role-based workspaces. The product is built around the practical pressures of perishable goods: timing, demand, freshness, and movement.
            </p>
          </div>
        </Section>

        <Section className="bg-slate-50">
          <div className="mb-12 max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
              Product principles
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Designed for work, not theatre</h2>
            <p className="mt-3 text-slate-600">
              Every screen should help a user understand status, make a decision, or complete a workflow with confidence.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((item) => (
              <Card key={item.title} className="h-full">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
                  <item.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-slate-950">{item.title}</h3>
                <p className="text-sm leading-6 text-slate-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section className="bg-white">
          <div className="rounded-lg bg-slate-950 px-6 py-10 text-center text-white md:px-10">
            <h2 className="text-3xl font-semibold tracking-tight">Need help evaluating the platform?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-300">
              Use the contact page to discuss a role-based rollout for farming, retail, or distribution teams.
            </p>
            <a href="/contact" className="mt-7 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Contact the team
            </a>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
