import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/site";

// Required for `output: "export"` — generate a static robots.txt at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/successfull", "/booking-confirmation"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
