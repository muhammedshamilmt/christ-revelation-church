import type { BlogPost } from "./useBlogPosts";

export function mapDbRowToBlogPost(row: any): BlogPost {
  const content =
    Array.isArray(row.content) && row.content.length > 0
      ? row.content.map((item: any, idx: number) =>
          typeof item === "string"
            ? { heading: idx === 0 ? "Understanding the foundation" : "Deep Dive", text: item }
            : {
                heading: item?.heading || "",
                text: item?.text || "",
                image: item?.image || undefined,
                videoEmbedUrl: item?.videoEmbedUrl || undefined,
              }
        )
      : [{ heading: "", text: "" }];

  const author =
    row.author && typeof row.author === "object"
      ? {
          name: row.author.name || "Pastor David Vance",
          role: row.author.role || "Senior Pastor",
          avatar: row.author.avatar || "",
          bio:
            row.author.bio ||
            "Dedicated to sharing insights and stories from our vibrant community.",
        }
      : typeof row.author === "string"
      ? {
          name: row.author,
          role: "Contributor",
          avatar: "",
          bio: "Dedicated to sharing insights and stories from our vibrant community.",
        }
      : {
          name: "Pastor David Vance",
          role: "Senior Pastor",
          avatar: "",
          bio: "Dedicated to sharing insights and stories from our vibrant community.",
        };

  return {
    id: String(row.id),
    title: row.title || "",
    excerpt: row.excerpt || "",
    content,
    pullQuote: row.pull_quote || row.pullQuote || "",
    category: row.category || "Faith",
    tags: Array.isArray(row.tags) ? row.tags : [row.category ? row.category.toUpperCase() : "FAITH"],
    status: row.status === "Draft" ? "Draft" : "Published",
    date: row.date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
    readTime: row.read_time || row.readTime || "5 MIN",
    image: row.image || "/images/hero-bg.png",
    author,
    views: Number(row.views || 0),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapBlogPostToDbRow(post: Partial<BlogPost>) {
  const row: Record<string, any> = {};
  if (post.id !== undefined) row.id = post.id;
  if (post.title !== undefined) row.title = post.title;
  if (post.excerpt !== undefined) row.excerpt = post.excerpt;
  if (post.content !== undefined) row.content = post.content;
  if (post.pullQuote !== undefined) row.pull_quote = post.pullQuote;
  if ((post as any).pull_quote !== undefined) row.pull_quote = (post as any).pull_quote;
  if (post.category !== undefined) row.category = post.category;
  if (post.tags !== undefined) row.tags = post.tags;
  if (post.status !== undefined) row.status = post.status;
  if (post.date !== undefined) row.date = post.date;
  if (post.readTime !== undefined) row.read_time = post.readTime;
  if ((post as any).read_time !== undefined) row.read_time = (post as any).read_time;
  if (post.image !== undefined) row.image = post.image;
  if (post.author !== undefined) row.author = post.author;
  if (post.views !== undefined) row.views = post.views;
  if (post.createdAt !== undefined) row.created_at = post.createdAt;
  row.updated_at = new Date().toISOString();
  return row;
}

