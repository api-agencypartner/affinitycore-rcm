/** Static export for GitHub Pages: every route is pre-rendered to HTML under /affinitycore-rcm. */
const base = process.env.NEXT_PUBLIC_BASE ?? '/affinitycore-rcm';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: base,
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE: base },
  // Imported images/videos resolve to plain URL strings (as they did under Vite), so <img src={x}> keeps working.
  images: { unoptimized: true, disableStaticImages: true },
  webpack(config, { isServer }) {
    if (process.env.NOMIN) config.optimization.minimize = false;
    config.module.rules.push({ resourceQuery: /raw/, type: 'asset/source' });
    config.module.rules.push({ test: /\.(png|jpe?g|webp|gif|svg|mp4|webm|woff2?)$/i, resourceQuery: { not: [/raw/] }, type: 'asset/resource', generator: { filename: 'static/media/[name].[hash][ext]' } });
    return config;
  },
};
export default nextConfig;
