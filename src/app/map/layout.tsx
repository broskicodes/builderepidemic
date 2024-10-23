import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Builder Epidemic Map",
    description: "An interactive map to discover builder events and communities happening near you.",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://builderepidemic.com/map",
      title: "Builder Epidemic Map",
      description: "An interactive map to discover builder events and communities happening near you.",
      siteName: "Builder Epidemic Map",
      images: [{
        url: "https://builderepidemic.com/images/map.png",
        width: 800,
        height: 548,
        alt: "Builder Epidemic Map",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Builder Epidemic Map",
      description: "An interactive map to discover builder events and communities happening near you.",
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