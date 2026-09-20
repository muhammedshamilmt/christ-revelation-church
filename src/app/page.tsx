import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import PhilosophySection from "@/components/home/PhilosophySection";
import SermonsSection from "@/components/home/SermonsSection";
import FeaturesGridSection from "@/components/home/FeaturesGridSection";
import AccessibilitySection from "@/components/home/AccessibilitySection";
import CtaSection from "@/components/home/CtaSection";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col">
      <Hero />
      <AboutSection />
      <AccessibilitySection />
      <ServicesSection />
      <FeaturesGridSection />
      <PhilosophySection />
      <SermonsSection />
      <CtaSection />
    </main>
  );
}
