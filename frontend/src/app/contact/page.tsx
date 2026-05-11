import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <>
      <Navbar />
      <main>
        <Section className="pt-32 pb-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium rounded-full mb-4">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
              Let&apos;s Talk
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
              Have questions about AgriForecast? Want to partner with us? We&apos;d love to hear from you. Our team is here to help farmers succeed.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <Card>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Send us a message</h2>
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Message</label>
                  <textarea rows={5} className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all resize-none" placeholder="How can we help?" />
                </div>
                <button type="submit" className="w-full px-6 py-3.5 bg-[var(--primary)] text-white font-medium rounded-xl hover:bg-[var(--foreground)] transition-colors">
                  Send Message
                </button>
              </form>
            </Card>

            <div className="space-y-6">
              <Card>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[var(--primary)]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-1">Email</h3>
                    <p className="text-[var(--muted-foreground)]">hello@agriforecast.in</p>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">We respond within 24 hours</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[var(--primary)]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-1">Phone</h3>
                    <p className="text-[var(--muted-foreground)]">+91 98765 43210</p>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">Mon-Sat, 9 AM - 6 PM IST</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-[var(--primary)]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-1">WhatsApp</h3>
                    <p className="text-[var(--muted-foreground)]">+91 98765 43210</p>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">Quick responses, supports Hindi</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[var(--primary)]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-1">Office</h3>
                    <p className="text-[var(--muted-foreground)]">Startup Hub, Baner Road<br />Pune, Maharashtra 411045</p>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">Visit us for a demo</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
