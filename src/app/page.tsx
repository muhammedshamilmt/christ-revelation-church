import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import PhilosophySection from "@/components/home/PhilosophySection";
import SermonsSection from "@/components/home/SermonsSection";
import FeaturesGridSection from "@/components/home/FeaturesGridSection";
import AccessibilitySection from "@/components/home/AccessibilitySection";
import FaqSection from "@/components/home/FaqSection";
import CtaSection from "@/components/home/CtaSection";
import Preloader from "@/components/ui/Preloader";
import AlternatingFeatureSection from "@/components/home/AlternatingFeatureSection";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col">
      <Preloader />
      <Hero />
      <AboutSection />
      <AccessibilitySection />
      <ServicesSection />
      <FeaturesGridSection />
      <PhilosophySection />
      <SermonsSection />
      <AlternatingFeatureSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
