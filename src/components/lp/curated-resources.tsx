import { ExternalLink } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function CuratedResources() {
  const resources = [
    {
      title: "Recommended Reading",
      description: "A list of books related to marketing, product design, and general builder mindset.",
      link: "https://crystalline-athlete-cc7.notion.site/recommended-reading-11dedcf0f3ba80428dcec83619e3279b?pvs=4",
    }
  ]

  return (
    <section className="py-12 container flex flex-col items-center justify-center">
      <span className="font-bold uppercase text-primary text-center mb-8">Curated Resources</span>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 mx-auto max-w-3xl">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 relative">
              <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{resource.title}</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </CardTitle>
              <CardDescription>
                {resource.description}
              </CardDescription>
            </CardHeader>
            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0">
              <span className="sr-only">Visit {resource.title}</span>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
