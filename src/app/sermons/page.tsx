import SermonsHero from "@/components/sermons/SermonsHero";
import SermonsFeatured from "@/components/sermons/SermonsFeatured";
import SermonsListSection from "@/components/sermons/SermonsListSection";
import CtaSection from "@/components/home/CtaSection";

export const metadata = {
  title: "Sermons | Christ Revelation Church",
  description: "Listen and watch our latest sermons.",
};

export default function SermonsPage() {
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <SermonsHero />
      <SermonsFeatured />
      <SermonsListSection />
      <CtaSection />
    </main>
  );
}
