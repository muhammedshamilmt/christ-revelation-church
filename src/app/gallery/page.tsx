import GalleryHero from "@/components/gallery/GalleryHero";
import AboutSection from "@/components/home/AboutSection";
import AboutGallerySection from "@/components/about/AboutGallerySection";
import CtaSection from "@/components/home/CtaSection";

export const metadata = {
  title: "Gallery | Christ Revelation Church",
  description: "Explore our gallery of events and gatherings.",
};

export default function GalleryPage() {
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <GalleryHero />
      <AboutSection />
      <AboutGallerySection />
      <CtaSection />
    </main>
  );
}
