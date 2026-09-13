import { buildMetadata } from "@/utils/site";

export const metadata = buildMetadata({
  title: "Café & Dining – Prime Promenade",
  description:
    "Relax at the Prime Promenade café — casual dining and artisanal coffee crafted for every moment of your day.",
  path: "/cafe",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
