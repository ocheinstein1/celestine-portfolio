import { NextResponse } from 'next/server';

const getMetaTag = (html: string, property: string): string | null => {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
};

const decodeEntities = (str: string) =>
  str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    const fetchUrl = url.startsWith('http') ? url : `https://${url}`;
    const encodedUrl = encodeURIComponent(fetchUrl);

    // ── Step 1: Microlink API (best quality, free tier) ──
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const mlRes = await fetch(
        `https://api.microlink.io/?url=${encodedUrl}&screenshot=true&meta=true`,
        {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      if (mlRes.ok) {
        const ml = await mlRes.json();
        if (ml.status === 'success') {
          const d = ml.data;
          return NextResponse.json({
            url: fetchUrl,
            title: d.title || fetchUrl,
            description: d.description || '',
            image: d.screenshot?.url || d.image?.url || '',
            favicon: d.logo?.url || `${new URL(fetchUrl).origin}/favicon.ico`,
            screenshot: d.screenshot?.url || '',
          });
        }
      }
    } catch (_) {
      // Microlink timed out or failed — continue to fallback
    }

    // ── Step 2: Manual HTML fetch for metadata ──
    let title = fetchUrl;
    let description = '';
    let image = '';
    const favicon = `${new URL(fetchUrl).origin}/favicon.ico`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const htmlRes = await fetch(fetchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (htmlRes.ok) {
        const html = await htmlRes.text();

        title = decodeEntities(
          getMetaTag(html, 'og:title') ||
          getMetaTag(html, 'twitter:title') ||
          html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ||
          fetchUrl
        );

        description = decodeEntities(
          getMetaTag(html, 'og:description') ||
          getMetaTag(html, 'twitter:description') ||
          getMetaTag(html, 'description') ||
          ''
        );

        const rawImage =
          getMetaTag(html, 'og:image') ||
          getMetaTag(html, 'twitter:image') || '';

        if (rawImage) {
          image = rawImage.startsWith('http')
            ? rawImage
            : `${new URL(fetchUrl).origin}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
        }
      }
    } catch (_) {
      // HTML fetch failed — use URL as title
    }

    // ── Step 3: Use screenshotone.com free endpoint for screenshot ──
    // This gives a real browser screenshot with no API key needed
    const screenshot = `https://api.screenshotone.com/take?url=${encodedUrl}&viewport_width=1280&viewport_height=800&format=jpg&image_quality=80`;

    return NextResponse.json({
      url: fetchUrl,
      title,
      description,
      image: image || screenshot,
      favicon,
      screenshot,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process URL' }, { status: 500 });
  }
}
