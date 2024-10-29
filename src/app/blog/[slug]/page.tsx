import { BlogPost } from "@/components/blog/blog-post";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { BlogPost as BlogPostType } from "@/lib/types";

async function getBlogPost(slug: string): Promise<BlogPostType> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ENV_URL}/api/blogposts/${slug}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blog post");
  }

  const data = await response.json();
  return {
    ...data,
    date: new Date(data.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const post = await getBlogPost(slug);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <main className="flex-1 flex flex-col h-screen w-full bg-background">
        <Header />
        <BlogPost post={post} />
      </main>
      <Footer />
    </div>
  );
}
