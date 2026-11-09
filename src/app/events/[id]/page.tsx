import EventDetail from "@/components/events/EventDetail";
import CtaSection from "@/components/home/CtaSection";

export const metadata = {
  title: "Event Details | Christ Revelation Church",
  description: "Explore event schedule, highlights, and reserve your spot.",
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <EventDetail id={id} />
      <CtaSection />
    </main>
  );
}

