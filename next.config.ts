import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           { key: 'X-Frame-Options', value: 'DENY' },
//           { key: 'Content-Security-Policy', value: "upgrade-insecure-requests" },
//           { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
//           { key: 'X-Content-Type-Options', value: 'nosniff' },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;