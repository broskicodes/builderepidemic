import { BlogSection } from "@/components/blog/blog-section";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { BlogPost } from "@/lib/types";

async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ENV_URL}/api/blogposts`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blog posts");
  }

  const data = await response.json();
  return data.map((post: any) => ({
    ...post,
    date: new Date(post.created_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  }));
}

export default async function Blog() {
  const posts = await getBlogPosts();

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <main className="flex-1 flex flex-col h-screen w-full bg-background">
        <Header />
        <BlogSection posts={posts} />
      </main>
      <Footer />
    </div>
  );
}
