import type { NextConfig } from "next";

// The storefront is fully static: every page is pre-built as plain HTML in `out/`,
// so it can be hosted anywhere (Cloudflare Pages, Netlify, GitHub Pages, ...).
const nextConfig: NextConfig = {
  output: "export",
  // Static hosting has no image optimiser, so images are served as-is.
  images: { unoptimized: true },
};

export default nextConfig;
