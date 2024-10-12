"use client"

import Link from "next/link";

import { Button } from "@/components/ui/button";
import SocialProofUsers from "./social-proof-users";
import { toast } from "sonner";

export default function Hero() {
    const handleJoinEpidemic = () => {
       toast.success("Idk what this means yet :)")
    }

    return (
        <section className="container flex flex-col items-center gap-8 pt-20 sm:gap-10 h-full justify-center flex-1">
        {/* <SocialProofUsers /> */}
        <h1 className="max-w-2xl text-center font-heading text-4xl font-semibold sm:text-5xl tracking-tight">
          The world needs more builders
        </h1>
        <div className="grid grid-cols-2 gap-3">
          <Button size="lg" asChild variant="outline" className="cursor-pointer border-border">
            <Link href="/about">Learn More</Link>
          </Button>
          <Button size="lg" className="cursor-pointer" onClick={handleJoinEpidemic}>
            Join the Epidemic
          </Button>
        </div>
        <div className="relative sm:mt-8">
          <div className="absolute inset-0 -z-10 bg-primary/20 [filter:blur(180px)]" />
        </div>
      </section>
    )
}