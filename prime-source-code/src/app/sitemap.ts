import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/site";

// Required for `output: "export"` — generate a static sitemap.xml at build time.
export const dynamic = "force-static";

// Public, indexable routes (success / confirmation pages are intentionally excluded).
const routes = [
  "",
  "/about",
  "/gallery",
  "/contact",
  "/terms",
  "/vendor",
  "/vendor-invite",
  "/gym",
  "/spa",
  "/pool-booking",
  "/conference",
  "/cafe",
  "/gaming",
  "/pharmacy",
  "/study-centre",
  "/prime-x-arena",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
