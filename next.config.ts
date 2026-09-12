import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  serverExternalPackages: ["playwright"],
  async redirects() {
    return [
      {
        source: "/courses/:slug/lessons/:lessonId",
        destination: "/learning/:slug/lessons/:lessonId",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
