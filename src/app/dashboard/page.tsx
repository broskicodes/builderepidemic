"use client";

import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { TweetDashboard } from "@/components/dashboard/tweet-dashboard";
import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background relative">
      <main className="flex-1 flex flex-col h-screen w-full bg-background">
        <Header />
        {clicked 
        ? <TweetDashboard /> 
        : (
            <section className="container flex flex-col items-center gap-8 pb-28 pt-20 sm:gap-10">
              <div className="items-center flex gap-3">
                <div className="flex">
                  <Avatar className="border-2 border-white">
                    <AvatarImage
                      alt="@john"
                      src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/sections-assets/testimonial-1.avif"
                    />
                  </Avatar>
                  <Avatar className="border-2 border-white -ml-4">
                    <AvatarImage
                      alt="@max"
                      src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/sections-assets/testimonial-2.avif"
                    />
                  </Avatar>
                  <Avatar className="border-2 border-white -ml-4">
                    <AvatarImage
                      alt="@bob"
                      src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/sections-assets/testimonial-3.avif"
                    />
                  </Avatar>
                  <Avatar className="border-2 border-white -ml-4">
                    <AvatarImage
                      alt="@emily"
                      src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/sections-assets/testimonial-4.avif"
                    />
                  </Avatar>
                  <Avatar className="border-2 border-white -ml-4">
                    <AvatarImage
                      alt="@michael"
                      src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/sections-assets/testimonial-5.avif"
                    />
                  </Avatar>
                </div>
                <div>
                  <div className="flex items-center">
                    <svg
                      fill="none"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polygon
                        fill="currentColor"
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                        className="text-yellow-500"
                      />
                    </svg>
                    <svg
                      fill="none"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polygon
                        fill="currentColor"
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                        className="text-yellow-500"
                      />
                    </svg>
                    <svg
                      fill="none"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polygon
                        fill="currentColor"
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                        className="text-yellow-500"
                      />
                    </svg>
                    <svg
                      fill="none"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polygon
                        fill="currentColor"
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                        className="text-yellow-500"
                      />
                    </svg>
                    <svg
                      fill="none"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polygon
                        fill="currentColor"
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                        className="text-yellow-500"
                      />
                    </svg>
                  </div>
                  <span className="mt-1 text-sm font-semibold text-muted-foreground">
                    Join
                    <span className="text-foreground">1000+</span>
                    shippers
                  </span>
                </div>
              </div>
              <h1 className="max-w-2xl text-center font-heading text-4xl font-semibold sm:text-5xl tracking-tight">
                Grow your Twitter audience
              </h1>
              <p className="max-w-lg text-center text-lg text-muted-foreground sm:text-xl">
                Analytics to help you understand Twitter trends so you can grow consistently.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button size="lg" variant="outline" asChild className="cursor-pointer border-border">
                  <Link href="#">Learn More</Link>
                </Button>
                <Button size="lg" className="cursor-pointer" onClick={() => setClicked(true)}>
                    Get Started
                </Button>
              </div>
              <div className="relative sm:mt-8">
                <Image
                  src="/images/dashboard.png"
                  alt="SaaS Dashboard"
                  width={1000}
                  height={698}
                  priority
                  className="rounded-xl border border-border shadow-lg"
                />
                <div className="absolute inset-0 -z-10 bg-primary/20 [filter:blur(180px)]" />
              </div>
            </section>
          )}
      </main>
      <Footer />
    </div>
  );
}
