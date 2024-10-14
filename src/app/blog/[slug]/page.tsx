"use client";

import { BlogPost } from "@/components/blog/blog-post";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import Tiptap from "@/components/tiptap/content";
import { useParams } from "next/navigation";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    if (!slug) return;

    posthog.capture("blog-viewed", {
      post: slug,
    });
  }, [slug]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <main className="flex-1 flex flex-col h-screen w-full bg-background">
        <Header />
        <BlogPost slug={slug} />
      </main>
      <Footer />
    </div>
  );
}
