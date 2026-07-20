import { buildMetadata } from "@/utils/site";

export const metadata = buildMetadata({
  title: "Gaming Zone – Prime Promenade",
  description:
    "Step into the Prime Promenade gaming zone — an indoor entertainment destination built for thrill, fun and unforgettable moments.",
  path: "/gaming",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
