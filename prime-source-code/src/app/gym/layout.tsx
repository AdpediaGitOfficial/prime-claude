import { buildMetadata } from "@/utils/site";

export const metadata = buildMetadata({
  title: "Oxy Gym – Prime Promenade",
  description:
    "Join Oxy Gym at Prime Promenade — a modern fitness and wellness space with world-class equipment for a healthier lifestyle.",
  path: "/gym",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
