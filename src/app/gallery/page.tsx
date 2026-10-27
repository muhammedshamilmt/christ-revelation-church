import GalleryHero from "@/components/gallery/GalleryHero";
import GallerySection from "@/components/gallery/GallerySection";
import CtaSection from "@/components/home/CtaSection";

export const metadata = {
  title: "Gallery | Christ Revelation Church",
  description: "Explore our living archive of moments, worship, conferences, and community gatherings at Christ Revelation Church.",
};

export default function GalleryPage() {
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <GalleryHero />
      <GallerySection />
      <CtaSection />
    </main>
  );
}
