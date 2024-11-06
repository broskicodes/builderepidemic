"use client";

import { Button } from "@/components/ui/button";
import { User, Zap } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JulianaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleAction = async () => {
    setIsLoading(true);
    
    if (!session) {
      await signIn("twitter");
      setIsLoading(false);
      return;
    }

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({ 
        priceId: process.env.NEXT_PUBLIC_PRICE_ID_10,
        user: session.user 
      }),
    });

    if (response.ok) {
      const data = await response.json();
      router.push(data.url);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Button
        disabled={isLoading || !!session?.user?.subscribed}
        size="lg"
        onClick={handleAction}
      >
        {!session ? (
          <>
            <User className="mr-2 h-5 w-5" /> Sign in with Twitter
          </>
        ) : (
          <>
            <Zap className="mr-2 h-5 w-5" />
            {session?.user?.subscribed ? "Subscribed" : isLoading ? "Loading..." : "Get Access"}
          </>
        )}
      </Button>
    </div>
  );
} 