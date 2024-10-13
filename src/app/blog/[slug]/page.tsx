"use client";

import { BlogPost } from "@/components/blog/blog-post";
import Footer from "@/components/layout/footer";
// import Header from "@/components/layout/header";
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
    <div>
      {/* <Header /> */}
      <BlogPost slug={slug} />
      <Footer />
    </div>
  );
}
