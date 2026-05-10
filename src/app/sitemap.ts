import type { MetadataRoute } from "next";
import { tumDestekler } from "@/data/destekler";
import { blogYazilari } from "@/data/blog";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.destektakip.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const statikSayfalar: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/destekler`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/firma`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/proje-asistani`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/planlar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/giris`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/kayit`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ];

  const destekSayfalar: MetadataRoute.Sitemap = tumDestekler.map((d) => ({
    url: `${BASE_URL}/destekler/${d.slug}`,
    lastModified: d.sonGuncelleme ? new Date(d.sonGuncelleme) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogSayfalar: MetadataRoute.Sitemap = blogYazilari.map((y) => ({
    url: `${BASE_URL}/blog/${y.slug}`,
    lastModified: new Date(y.yayinTarihi),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...statikSayfalar, ...destekSayfalar, ...blogSayfalar];
}
