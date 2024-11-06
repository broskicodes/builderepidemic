"use client";

import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { PersonalDashboard } from "@/components/dashboard/personal-dashboard";
import { TweetDashboard } from "@/components/dashboard/tweet-dashboard";
import { useSession } from "next-auth/react";
import HeroDash from "@/components/lp/hero-dash";
import { PricingDash } from "@/components/lp/pricing-dash";
import RoadmapDash from "@/components/lp/roadmap-dash";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen w-full bg-background relative">
      <main className="flex-1 flex flex-col h-screen w-full bg-background">
        <Header />
        {session?.user.subscribed ? (
          <div className="container mx-auto py-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="personal">Personal Dashboard</TabsTrigger>
                <TabsTrigger value="tweets">Latest Viral Tweets</TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <PersonalDashboard />
              </TabsContent>
              <TabsContent value="tweets">
                <TweetDashboard />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <>
            <HeroDash />
            <RoadmapDash />
            <PricingDash />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
