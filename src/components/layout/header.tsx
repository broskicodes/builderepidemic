"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MobileNavbar } from "@/components/layout/mobile-navbar";
import { toast } from "sonner";
import posthog from "posthog-js";
import { Logo } from "./logo";

const links = [
  {
    title: "Blog",
    link: "/blog",
  },
  {
    title: "Map",
    link: "/map",
  },
  {
    title: "About",
    link: "/about",
  },
];

export function Header() {
  const handleJoinEpidemic = () => {
    posthog.capture("cta-clicked");
    toast.success("Idk what this means yet :)");
  };

  return (
    <header className="container flex items-center justify-between gap-4 sm:gap-10 py-4">
      <Link href="/" className="flex items-center gap-1">
        <Logo scale={0.7} />
        <span className="font-heading text-xl font-bold mt-1">Builder Epidemic</span>
      </Link>
      <div className="flex items-center gap-10">
        <nav className="hidden items-center gap-10 md:flex justify-end">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.link}
              className="flex cursor-pointer items-center text-lg font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
            >
              {link.title}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button onClick={handleJoinEpidemic}>Join the Epidemic</Button>
        </div>
      </div>
      <MobileNavbar>
        <div className="rounded-b-lg bg-background py-4 container text-foreground shadow-xl">
          <nav className="flex flex-col gap-1 pt-2">
            <Link
              href="/about"
              className="flex w-full cursor-pointer items-center rounded-md p-2 font-medium text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="flex w-full cursor-pointer items-center rounded-md p-2 font-medium text-muted-foreground hover:text-foreground"
            >
              Blog
            </Link>

            <Button onClick={handleJoinEpidemic} size="lg" className="mt-2 w-full">
              Join the Epidemic
            </Button>
          </nav>
        </div>
      </MobileNavbar>
    </header>
  );
}
