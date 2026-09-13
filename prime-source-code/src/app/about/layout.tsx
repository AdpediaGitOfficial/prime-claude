import { buildMetadata } from "@/utils/site";

export const metadata = buildMetadata({
  title: "About Us – Prime Promenade",
  description:
    "Discover Prime Promenade — a premium four-floor lifestyle destination in Thrissur, Kerala, uniting fitness, wellness, business and leisure under one roof.",
  path: "/about",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
