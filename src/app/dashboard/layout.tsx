import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Twitter Resonator",
  description: "A tool to help you find and replicate content that is working on Twitter.",
  openGraph: {
    siteName: "Twitter Resonator",
    images: [
      {
        url: "https://builderepidemic.com/images/dash-stats.png",
        width: 1200,
        height: 630,
        alt: "Twitter Resonator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter Resonator",
    description: "A tool to help you find and replicate content that is working on Twitter.",
    images: ["https://builderepidemic.com/images/dash-stats.png"],
    creator: "@braedenhall_",
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
