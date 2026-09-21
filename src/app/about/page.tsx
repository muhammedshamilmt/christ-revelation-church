import AboutHero from "@/components/about/AboutHero";
import AboutIntro from "@/components/about/AboutIntro";
import AboutImageSection from "@/components/about/AboutImageSection";
import AboutDetails from "@/components/about/AboutDetails";
import AboutMeetSection from "@/components/about/AboutMeetSection";
import AboutCultureSection from "@/components/about/AboutCultureSection";
import AboutGallerySection from "@/components/about/AboutGallerySection";
import AlternatingFeatureSection from "@/components/home/AlternatingFeatureSection";
import CtaSection from "@/components/home/CtaSection";
import FeaturesGridSection from "@/components/home/FeaturesGridSection";

export const metadata = {
  title: "About | Christ Revelation Church",
  description: "Learn more about Christ Revelation Church, our mission, and our community.",
};

export default function AboutPage() {
  return (
    <main className="w-full flex flex-col bg-dark min-h-screen">
      <AboutHero />
      <AboutIntro />
      <AboutImageSection />
      <AboutDetails />
      <AlternatingFeatureSection />
      <FeaturesGridSection />
      <AboutMeetSection />
      <AboutCultureSection />
      <AboutGallerySection />
      <CtaSection />
    </main>
  );
}
