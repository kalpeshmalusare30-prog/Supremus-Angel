/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // Enables styled-components SWC transform: stable class names,
    // SSR support, and readable debug labels (TRD §9.3).
    styledComponents: true,
  },
};

export default nextConfig;
