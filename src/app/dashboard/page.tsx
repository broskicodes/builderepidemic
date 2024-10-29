import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { TweetAnalyticsDashboardComponent } from "@/components/dashboard/tweet-analytics-dashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background relative">
      <main className="flex-1 flex flex-col h-screen w-full bg-background">
        <Header />
        <TweetAnalyticsDashboardComponent />
      </main>
      <Footer />
    </div>
  );
}
