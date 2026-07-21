"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const NAV: Array<{ group: string; items: Array<{ href: string; label: string; icon: string }> }> = [
  { group: "Overview", items: [{ href: "/", label: "Dashboard", icon: "▤" }] },
  {
    group: "Manage",
    items: [
      { href: "/bookings", label: "Bookings", icon: "▦" },
      { href: "/enquiries", label: "Enquiries", icon: "✉" },
      { href: "/packages", label: "Packages", icon: "❑" },
      { href: "/counters", label: "Vendor Counters", icon: "▣" },
    ],
  },
  { group: "Website", items: [{ href: "/content", label: "Content & Settings", icon: "◨" }] },
];

const TITLES: Record<string, [string, string]> = {
  "/": ["Dashboard", "Bookings & enquiries at a glance"],
  "/bookings": ["Bookings", "Manage every reservation across the venue"],
  "/enquiries": ["Enquiries", "Gym, vendor, course & contact leads"],
  "/packages": ["Packages", "Pool packages, spa services & courses"],
  "/counters": ["Vendor Counters", "Control live availability on the /vendor page"],
  "/content": ["Website", "Content, banners & settings"],
};

function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);
  useEffect(() => {
    const saved = localStorage.getItem("pp_admin_theme");
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
      setTheme(saved);
    }
  }, []);
  const toggle = () => {
    const current =
      document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("pp_admin_theme", next);
    setTheme(next);
  };
  return (
    <button className="icon-btn" onClick={toggle} title="Toggle theme" aria-label="Toggle theme">
      ◐
    </button>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const { admin, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) router.replace("/login");
  }, [loading, admin, router]);

  if (loading || !admin) {
    return (
      <div className="center-load" style={{ minHeight: "100vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  const [title, sub] = TITLES[pathname] ?? ["Admin", ""];
  const initials = admin.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="app">
      <aside>
        <div className="brand-row">
          <div className="brand-mark">P</div>
          <div>
            <div className="brand-name" style={{ fontSize: 15 }}>
              Prime Promenade
            </div>
            <div className="brand-sub">Admin</div>
          </div>
        </div>

        {NAV.map((section) => (
          <div key={section.group}>
            <div className="nav-label">{section.group}</div>
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item${active ? " active" : ""}`}
                >
                  <span className="ic">{item.icon}</span> {item.label}
                </Link>
              );
            })}
          </div>
        ))}

        <div className="nav-spacer" />
        <div className="nav-foot">
          <div className="avatar">{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 650,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {admin.name}
            </div>
            <div className="brand-sub">{admin.role.replace(/_/g, " ").toLowerCase()}</div>
          </div>
          <button className="logout" onClick={() => void signOut()} title="Sign out" aria-label="Sign out">
            ⎋
          </button>
        </div>
      </aside>

      <main>
        <div className="topbar">
          <div>
            <h1>{title}</h1>
            <div className="sub">{sub}</div>
          </div>
          <div className="top-actions">
            <ThemeToggle />
          </div>
        </div>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
