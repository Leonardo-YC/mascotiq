import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mascotiq.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/quiz",
    "/planes",
    "/catalogo",
    "/nosotros",
    "/terminos",
    "/privacidad",
    "/reembolsos",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "/catalogo" ? "weekly" : route === "/quiz" ? "monthly" : "yearly") as any,
    priority: route === "" ? 1 : route === "/quiz" ? 0.9 : 0.7,
  }));

  return routes;
}