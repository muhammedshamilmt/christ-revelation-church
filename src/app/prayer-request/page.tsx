import PrayerRequestHero from "@/components/prayer-request/PrayerRequestHero";
import AboutSection from "@/components/home/AboutSection";
import PrayerRequestForm from "@/components/prayer-request/PrayerRequestForm";
import CtaSection from "@/components/home/CtaSection";

export const metadata = {
  title: "Prayer Request | Christ Revelation Church",
  description: "Submit your prayer requests. Let us stand with you in faith.",
};

export default function PrayerRequestPage() {
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <PrayerRequestHero />
      <AboutSection />
      <PrayerRequestForm />
      <CtaSection />
    </main>
  );
}
