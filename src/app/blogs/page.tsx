import BlogsGrid from "@/components/blogs/BlogsGrid";
import CtaSection from "@/components/home/CtaSection";

export const metadata = {
  title: "Blogs | Christ Revelation Church",
  description: "Read our latest stories, testimonies, and insights.",
};

export default function BlogsPage() {
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <BlogsGrid />
      <CtaSection />
    </main>
  );
}
