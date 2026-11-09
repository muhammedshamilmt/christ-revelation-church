import SermonDetail from "@/components/sermons/SermonDetail";
import CtaSection from "@/components/home/CtaSection";
import { findSermonById } from "@/lib/sermons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sermon = findSermonById(id);
  return {
    title: sermon
      ? `${sermon.title} – Sermons | Christ Revelation Church`
      : "Sermon | Christ Revelation Church",
    description:
      sermon?.excerpt ||
      "Listen and watch our latest sermons from Christ Revelation Church.",
  };
}

export default async function SermonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <SermonDetail id={id} />
      <CtaSection />
    </main>
  );
}

