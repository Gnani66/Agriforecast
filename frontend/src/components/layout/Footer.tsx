import Link from "next/link";

const portalLinks = [
  { label: "Farmer sign in", href: "/farmer/login" },
  { label: "Retailer sign in", href: "/retailer/login" },
  { label: "Distributor sign in", href: "/distributor/login" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <span className="text-xl font-semibold">AgriForecast</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Role-based forecasting, inventory, and logistics software for agricultural supply chains.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Platform</h3>
            <ul className="space-y-2.5">
              <li><Link href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#workflow" className="text-sm text-slate-400 hover:text-white transition-colors">Workflow</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contact sales</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Portals</h3>
            <ul className="space-y-2.5">
              {portalLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/farmer/signup" className="text-sm text-slate-400 hover:text-white transition-colors">Create account</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">AgriForecast. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">Company</Link>
            <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
