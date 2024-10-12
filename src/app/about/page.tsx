import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center h-full flex flex-col flex-1 justify-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          The Builder Epidemic
        </h1>
        <p className="text-xl text-muted-foreground">
          The world is plagued by millions of issues. Climate change, world hunger, education
          reform, digital privacy, homelessness, governments, drug addiction, social media addiction
          etc. Existing systems are not working to fix them. We need innovation. We need creative
          entrepreneurs and builders working on solutions to these problems.{" "}
        </p>
        <p className="text-xl text-muted-foreground">
          Everybody has it in them to become a builder, but there just aren&apos;t enough resources
          to help them learn. That&apos;s where we come in. Our goal is to spread information like a
          virus. To infect as many people as possible with the &quot;builders bug&quot; and get them
          working on solutions to real problems. We have a long way to go, but every epidemic starts
          with patient 0. Will it be you?
        </p>
        <div className="flex justify-center">
          <Button className="font-semibold">
            Join the Epidemic
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
