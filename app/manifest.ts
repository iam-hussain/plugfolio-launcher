import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Plugfolio",
    short_name: "Plugfolio",
    description:
      "Plugfolio turns your reels, videos, and posts into a shoppable storefront — one link in your bio that turns content into product clicks, affiliate revenue, and brand deals.",
    start_url: "/",
    display: "standalone",
    background_color: "#0C0A16",
    theme_color: "#0C0A16",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
