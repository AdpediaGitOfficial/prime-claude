import type { Metadata } from "next";

export const metadata: Metadata = { title: "Aqua & Wellness – Prime Promenade" };

export default function PoolBookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
