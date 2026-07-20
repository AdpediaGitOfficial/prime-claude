import { buildMetadata } from "@/utils/site";

export const metadata = buildMetadata({
  title: "Vendor Invite – Prime Promenade",
  description:
    "Partner with Prime Promenade — invite for fashion, food & beverage, health & wellness and retail vendors to join our destination.",
  path: "/vendor-invite",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
