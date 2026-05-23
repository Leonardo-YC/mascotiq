import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mascotiq.vercel.app";

type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

function getChangeFrequency(route: string): ChangeFrequency {
  if (route === "/catalogo") return "weekly";
  if (route === "/quiz") return "monthly";
  return "yearly";
}

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
    changeFrequency: getChangeFrequency(route),
    priority: route === "" ? 1 : route === "/quiz" ? 0.9 : 0.7,
  }));

  return routes;
}