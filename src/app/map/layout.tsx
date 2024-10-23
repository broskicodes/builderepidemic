import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Builder Epidemic Map",
    description: "An interactive map to discover builder events and communities near you.",
    openGraph: {
      siteName: "Builder Epidemic Map",
      images: [{
        url: "https://builderepidemic.com/images/map.png",
        width: 1200,
        height: 630,
        alt: "Builder Epidemic Map",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Builder Epidemic Map",
      description: "An interactive map to discover builder events and communities near you.",
      images: ["https://builderepidemic.com/images/map.png"],
      creator: "@braedenhall_",
    },
  };

export default function MapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}