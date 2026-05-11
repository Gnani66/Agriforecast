import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import ProblemSection from "@/components/sections/ProblemSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import WorkflowSection from "@/components/sections/WorkflowSection";
import PortalsSection from "@/components/sections/PortalsSection";
import DashboardPreview from "@/components/sections/DashboardPreview";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <WorkflowSection />
        <PortalsSection />
        <DashboardPreview />
      </main>
      <Footer />
    </>
  );
}
