import type { Metadata } from "next";

/**
 * Canonical site URL. Used for metadataBase, canonical URLs, Open Graph URLs,
 * the sitemap and robots.txt. Change this if the production domain differs.
 */
export const SITE_URL = "https://primepromenade.com";
export const SITE_NAME = "Prime Promenade";

/** Default social-share image (must exist in /public). */
export const DEFAULT_OG_IMAGE = "/ASSETS/banner-main.jpg";

/**
 * Build a consistent Metadata object for a page: title, description, canonical
 * URL, Open Graph and Twitter cards. Relative `path` values resolve against
 * `metadataBase` (set in the root layout).
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  noindex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
