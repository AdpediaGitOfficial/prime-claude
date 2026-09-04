// Prime Promenade wordmark. Renders both variants; CSS shows the dark one on
// light surfaces and the white one on dark. Prefixes the app basePath so the
// asset resolves whether the admin is served at / or /admin.
export default function BrandLogo({ height = 30 }: { height?: number }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="brand-logo on-light"
        src={`${base}/LOGO/logo-main.svg`}
        alt="Prime Promenade"
        style={{ height }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="brand-logo on-dark"
        src={`${base}/LOGO/logo-main-white.svg`}
        alt="Prime Promenade"
        style={{ height }}
      />
    </>
  );
}
