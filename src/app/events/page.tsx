import EventsHero from "@/components/events/EventsHero";
import EventsListSection from "@/components/events/EventsListSection";
import CtaSection from "@/components/home/CtaSection";

export const metadata = {
  title: "Events | Christ Revelation Church",
  description: "Join us for our upcoming events, gatherings, and celebrations.",
};

export default function EventsPage() {
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <EventsHero />
      <EventsListSection />
      <CtaSection />
    </main>
  );
}
