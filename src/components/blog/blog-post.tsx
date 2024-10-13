import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
// import { CONSOLE_API_URL } from "@/lib/constants";
// import { useAuth } from "@/providers/auth-provider";
import { BlogPost as BlogPostType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import posthog from "posthog-js";

export const BlogPost = ({ slug }: { slug: string }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [post, setPost] = useState<BlogPostType | null>(null);
  const router = useRouter();

  // const { user } = useAuth();

  const fetchPost = useCallback(async () => {
    // if (!user) return;

    // if (user.email) {
    //   setRegistered(true);
    // }

    const response = await fetch(`/api/blogposts/${slug}`, {
      method: "GET",
    });

    const data = await response.json();

    setPost((_) => {
      return {
        ...data,
        date: new Date(data.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
    });
  }, [slug]);

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

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (!post) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

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
        <ReactMarkdown
          components={{
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-gray-300 pl-4 italic my-4"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul className="ml-6 list-disc my-4" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-2xl font-semibold mt-4 mb-2" {...props} />
            ),
            hr: ({ node, ...props }) => (
              <hr className="my-4 border-t-2 border-gray-200" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-2 text-lg" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a
                className="text-primary hover:text-primary/70 underline"
                {...props}
              />
            ),
          }}
        >
          {post.content.replace(/\n/g, "  \n")}
        </ReactMarkdown>
      </div>
      {!registered ? (
        <div className="mt-12 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-2">
            Subscribe to our newsletter
          </h3>
          <p className="mb-4">
            Stay up to date with our latest blog posts and news.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <Input
              type="text"
              disabled={loading}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="mt-12 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-primary">
            {"You're subscribed!"}
          </h3>
        </div>
      )}
    </article>
  );
};
