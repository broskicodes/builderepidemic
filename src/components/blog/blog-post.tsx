"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPost as BlogPostType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import posthog from "posthog-js";
import TiptapContent, { TiptapContentRef } from "../tiptap/content";

export const BlogPost = ({ post }: { post: BlogPostType }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const router = useRouter();

  const tiptapEditorRef = useRef<TiptapContentRef>(null);
  const [canEdit] = useState(false);

  const savePost = useCallback(async () => {
    const editor = tiptapEditorRef.current?.getEditor();

    if (!editor) return;

    const markdown = editor.storage.markdown.getMarkdown();

    const response = await fetch(`/api/blogposts/${post.slug}`, {
      method: "POST",
      body: JSON.stringify({ content: markdown }),
    });

    if (response.ok) {
      toast.success("Post saved");
    } else {
      toast.error("An error occurred while saving the post");
    }
  }, [post.slug]);

  const sendPost = useCallback(async () => {
    console.log("send post");
  }, []);

  const handleSubscribe = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setLoading(true);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/subscribe`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEmail("");
        setRegistered(true);
        posthog.capture("newlestter-sub", { email });
      } else {
        toast.error("An error occurred while subscribing");
        posthog.capture("newlestter-sub-failed", { email });
      }

      setLoading(false);
    },
    [email],
  );

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
      </Button>
      <img
        src={post.image_url || ""}
        alt={post.title}
        width={800}
        height={400}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-xl text-muted-foreground mb-2">{post.description}</p>
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <span className="text-foreground">By {post.author}</span>
        <span className="mx-2">•</span>
        <time>{post.date}</time>
      </div>
      <div className="prose prose-lg w-full text-foreground">
        <TiptapContent content={post.content} editable={canEdit} ref={tiptapEditorRef} />
      </div>
      {canEdit && (
        <div className="mt-4">
          <Button onClick={savePost}>Save</Button>
          <Button onClick={sendPost}>Send</Button>
        </div>
      )}
      {!registered ? (
        <div className="mt-12 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-2">Subscribe to our newsletter</h3>
          <p className="mb-4">Stay up to date with our latest blog posts and news.</p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <Input
              type="text"
              disabled={loading}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="grow"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="mt-12 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-primary">{"You're subscribed!"}</h3>
        </div>
      )}
    </article>
  );
};
