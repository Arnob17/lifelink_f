import Parser from "rss-parser";

export type ExternalNewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt?: string;
  imageUrl?: string;
};

type FeedDef = { url: string; source: string };

const FEEDS: FeedDef[] = [
  { url: "https://www.prothomalo.com/feed/", source: "প্রথম আলো" },
  { url: "https://bangla.bdnews24.com/rss.xml", source: "BDNews24" },
  { url: "https://www.thedailystar.net/top-news/rss.xml", source: "The Daily Star" },
];

const parser = new Parser({
  timeout: 8000,
  requestOptions: {
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml, */*",
      "User-Agent": "LifeLink/1.0 (+https://lifelink.local) RSS reader",
    },
  },
  customFields: {
    item: ["media:content", "media:thumbnail", "content:encoded"],
  },
});

function absolutize(url: string | undefined, base: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url.trim(), base).href;
  } catch {
    return url;
  }
}

function firstImgFromHtml(html: string): string | undefined {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1];
}

function pickImage(raw: Record<string, unknown>, link: string, feedUrl: string): string | undefined {
  const enc = raw.enclosure as { url?: string; type?: string } | undefined;
  if (enc?.url && (enc.type?.startsWith("image") || /\.(jpe?g|png|webp|gif)(\?|$)/i.test(enc.url))) {
    return absolutize(enc.url, feedUrl);
  }

  const thumb = raw["media:thumbnail"] as
    | { $?: { url?: string }; url?: string }
    | Array<{ $?: { url?: string } }>
    | undefined;
  const thumbOne = Array.isArray(thumb) ? thumb[0] : thumb;
  const thumbUrl = thumbOne?.$?.url ?? (thumbOne as { url?: string })?.url;
  if (thumbUrl) return absolutize(thumbUrl, feedUrl);

  const media = raw["media:content"] as
    | { $?: { url?: string; type?: string }; url?: string; type?: string }
    | Array<{ $?: { url?: string; type?: string } }>
    | undefined;
  const mediaOne = Array.isArray(media) ? media[0] : media;
  const mediaUrl = mediaOne?.$?.url ?? (mediaOne as { url?: string })?.url;
  const mediaType = mediaOne?.$?.type ?? (mediaOne as { type?: string })?.type;
  if (mediaUrl && (mediaType?.startsWith("image") || /\.(jpe?g|png|webp|gif)(\?|$)/i.test(mediaUrl))) {
    return absolutize(mediaUrl, feedUrl);
  }

  const html =
    (raw["content:encoded"] as string) ||
    (raw.content as string) ||
    (raw.description as string) ||
    "";
  const fromHtml = firstImgFromHtml(String(html));
  if (fromHtml) return absolutize(fromHtml, link || feedUrl);

  return undefined;
}

function stableId(link: string, title: string) {
  const base = `${link}|${title}`.slice(0, 200);
  let h = 0;
  for (let i = 0; i < base.length; i++) h = (Math.imul(31, h) + base.charCodeAt(i)) | 0;
  return `ext-${Math.abs(h).toString(36)}`;
}

async function loadFeed(def: FeedDef): Promise<ExternalNewsItem[]> {
  const parsed = await parser.parseURL(def.url);
  const out: ExternalNewsItem[] = [];
  for (const item of parsed.items ?? []) {
    const link = item.link?.trim();
    const title = item.title?.trim();
    if (!link || !title) continue;
    const raw = item as unknown as Record<string, unknown>;
    const imageUrl = pickImage(raw, link, def.url);
    out.push({
      id: stableId(link, title),
      title,
      link,
      source: def.source,
      publishedAt: item.pubDate ?? item.isoDate,
      imageUrl,
    });
  }
  return out;
}

export async function fetchExternalNews(maxItems = 18): Promise<ExternalNewsItem[]> {
  const settled = await Promise.allSettled(FEEDS.map((f) => loadFeed(f)));
  const merged: ExternalNewsItem[] = [];
  for (const r of settled) {
    if (r.status === "fulfilled") merged.push(...r.value);
  }
  const seen = new Set<string>();
  const deduped: ExternalNewsItem[] = [];
  for (const it of merged) {
    if (seen.has(it.link)) continue;
    seen.add(it.link);
    deduped.push(it);
  }
  deduped.sort((a, b) => {
    const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return tb - ta;
  });
  return deduped.slice(0, maxItems);
}
