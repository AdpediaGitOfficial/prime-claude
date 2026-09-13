import { buildMetadata } from "@/utils/site";

export const metadata = buildMetadata({
  title: "Prime X Arena – Prime Promenade",
  description:
    "Prime X Arena — the ultimate indoor entertainment destination featuring bowling, F1 and flight simulators, PS5 lounge, laser tag and more.",
  path: "/prime-x-arena",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
