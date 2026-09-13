import { buildMetadata } from "@/utils/site";

export const metadata = buildMetadata({
  title: "Me Glow Spa & Wellness – Prime Promenade",
  description:
    "Book spa, salon and wellness treatments at Me Glow, Prime Promenade — massages, facials, aromatherapy and more in Thrissur.",
  path: "/spa",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
