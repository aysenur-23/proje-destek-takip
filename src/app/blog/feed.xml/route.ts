import { NextResponse } from "next/server";
import { blogYazilari } from "@/data/blog";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.destektakip.com";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 saat cache

export function GET() {
  const items = blogYazilari
    .slice()
    .sort((a, b) => b.yayinTarihi.localeCompare(a.yayinTarihi))
    .map(
      (yazi) => `
    <item>
      <title><![CDATA[${yazi.baslik}]]></title>
      <link>${BASE_URL}/blog/${yazi.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${yazi.slug}</guid>
      <description><![CDATA[${yazi.ozet}]]></description>
      <pubDate>${new Date(yazi.yayinTarihi).toUTCString()}</pubDate>
      <category><![CDATA[${yazi.kategori}]]></category>
      ${yazi.etiketler.map((e) => `<category><![CDATA[${e}]]></category>`).join("\n      ")}
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Destek Takip Blog — Hibe &amp; Teşvik Rehberleri</title>
    <link>${BASE_URL}/blog</link>
    <description>TÜBİTAK, KOSGEB, AB fonları ve Ar-Ge teşvikleri hakkında güncel rehberler ve uzman analizleri.</description>
    <language>tr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/logo.svg</url>
      <title>Destek Takip</title>
      <link>${BASE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
