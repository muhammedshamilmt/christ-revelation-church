import type { Metadata } from "next";
import MinistryDetail from "@/components/ministries/MinistryDetail";
import CtaSection from "@/components/home/CtaSection";
import { findMinistryById } from "@/lib/ministries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const ministry = findMinistryById(id);

  if (!ministry) {
    return {
      title: "Ministry Not Found | Christ Revelation Church",
    };
  }

  return {
    title: `${ministry.title} | Christ Revelation Church`,
    description: ministry.description,
  };
}

export default async function MinistryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <MinistryDetail id={id} />
      <CtaSection />
    </main>
  );
}

