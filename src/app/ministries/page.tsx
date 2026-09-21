import MinistriesHero from "@/components/ministries/MinistriesHero";
import MinistriesList from "@/components/ministries/MinistriesList";
import CtaSection from "@/components/home/CtaSection";

export const metadata = {
  title: "Our Ministries | Christ Revelation Church",
  description: "Explore the ministries at Christ Revelation Church. Find your place to serve, worship, and grow.",
};

export default function MinistriesPage() {
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <MinistriesHero />
      <MinistriesList />
      <CtaSection />
    </main>
  );
}
