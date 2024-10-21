"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import SocialProofUsers from "./social-proof-users";
import { toast } from "sonner";
import posthog from "posthog-js";
import { SignupForm } from "./signup-form";
import { SIGNUP_EVENT } from '@/lib/types';

export default function Hero() {
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    const signedUp = localStorage.getItem('signedUp') === 'true';
    setIsSignedUp(signedUp);

    const handleSignup = () => {
      setIsSignedUp(true);
    };

    window.addEventListener(SIGNUP_EVENT, handleSignup);

    return () => {
      window.removeEventListener(SIGNUP_EVENT, handleSignup);
    };
  }, []);

  const handleJoinEpidemic = () => {
    posthog.capture("cta-clicked");
    // toast.success("Idk what this means yet :)");
  };

  return (
    <section className="container flex flex-col items-center gap-8 pt-20 sm:gap-10 h-full justify-center flex-1 min-h-96">
      {/* <SocialProofUsers /> */}
      <h1 className="max-w-2xl text-center font-heading text-4xl font-semibold sm:text-5xl tracking-tight">
        The world needs more builders
      </h1>
      <div className="grid grid-cols-2 gap-3">
        <Button size="lg" asChild variant="outline" className="cursor-pointer border-border">
          <Link href="/blog/why-build">Learn More</Link>
        </Button>
        <SignupForm>
          <Button onClick={handleJoinEpidemic} size="lg" className="cursor-pointer" disabled={isSignedUp}>
            {isSignedUp ? "Already Joined" : "Join the Epidemic"}
          </Button>
        </SignupForm>
      </div>
    </section>
  );
}
