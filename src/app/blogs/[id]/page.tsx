import BlogDetail from "@/components/blogs/BlogDetail";
import CtaSection from "@/components/home/CtaSection";

export const metadata = {
  title: "Blog Post | Christ Revelation Church",
  description: "Read our latest story.",
};

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <BlogDetail id={id} />
    </main>
  );
}
