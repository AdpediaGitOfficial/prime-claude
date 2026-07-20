import { buildMetadata } from "@/utils/site";

export const metadata = buildMetadata({
  title: "Gallery – Prime Promenade",
  description:
    "Explore the Prime Promenade gallery — a visual tour of our fitness, wellness, dining and entertainment spaces.",
  path: "/gallery",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
