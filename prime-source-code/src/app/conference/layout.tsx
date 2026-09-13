import { buildMetadata } from "@/utils/site";

export const metadata = buildMetadata({
  title: "Conference & Event Halls – Prime Promenade",
  description:
    "Book premium conference and event halls at Prime Promenade — ideal for corporate meetings, celebrations and gatherings in Thrissur.",
  path: "/conference",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
