import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.ssobig.com",
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: "https://www.ssobig.com/playroom",
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: "https://www.ssobig.com/offline",
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: "https://www.ssobig.com/offline/11namme",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://www.ssobig.com/offline/mafia",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://www.ssobig.com/offline/manito",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://www.ssobig.com/project",
      lastModified: new Date(),
      priority: 0.7,
    },
  ];
}
