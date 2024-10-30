"use client";

import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { TweetDashboard } from "@/components/dashboard/tweet-dashboard";
import { useSession } from "next-auth/react";
import HeroDash from "@/components/lp/hero-dash";
import { useEffect } from "react";
import { PricingDash } from "@/components/lp/pricing-dash";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen w-full bg-background relative">
      <main className="flex-1 flex flex-col h-screen w-full bg-background">
        <Header />
        {session?.user.subscribed ? (
          <TweetDashboard />
        ) : (
          <>
            <HeroDash />
            <PricingDash />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
