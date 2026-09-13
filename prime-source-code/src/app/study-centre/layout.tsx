import { buildMetadata } from "@/utils/site";

export const metadata = buildMetadata({
  title: "Study Centre – Prime Promenade",
  description:
    "Steel Tek by Prime — a specialised centre for structural steel design and Tekla training. Enrol in Tekla Structures or Structural Steel Design courses in Thrissur.",
  path: "/study-centre",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
