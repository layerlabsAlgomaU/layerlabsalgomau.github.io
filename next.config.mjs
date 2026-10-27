/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build plain HTML/CSS/JS files into the "out" folder, so the site can be hosted
  // anywhere (GitHub Pages included). There is no Node server to run.
  output: 'export',

  // One folder per page (out/about/index.html) works best on static hosts.
  trailingSlash: true,

  // The image optimizer needs a server, so it is switched off for a static export.
  images: { unoptimized: true },
};

export default nextConfig;
