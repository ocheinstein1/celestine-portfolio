import { NextResponse } from 'next/server';

const getMetaTag = (html: string, property: string) => {
  const regex = new RegExp(`<meta(?: [^>]+)? (?:property|name)=["']${property}["'](?: [^>]+)? content=["']([^"']+)["']`, 'i');
  const match = html.match(regex);
  if (match) return match[1];
  const regexRev = new RegExp(`<meta(?: [^>]+)? content=["']([^"']+)["'](?: [^>]+)? (?:property|name)=["']${property}["']`, 'i');
  const matchRev = html.match(regexRev);
  return matchRev ? matchRev[1] : null;
};

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    const fetchUrl = url.startsWith('http') ? url : `https://${url}`;

    // --- Step 1: Try Microlink API for screenshot + metadata ---
    try {
      const microlinkRes = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(fetchUrl)}&screenshot=true&meta=true&embed=screenshot.url`,
        { headers: { 'Accept': 'application/json' } }
      );

      if (microlinkRes.ok) {
        const mlData = await microlinkRes.json();
        if (mlData.status === 'success') {
          const d = mlData.data;
          return NextResponse.json({
            url: fetchUrl,
            title: d.title || fetchUrl,
            description: d.description || '',
            image: d.screenshot?.url || d.image?.url || '',
            favicon: d.logo?.url || '',
            screenshot: d.screenshot?.url || '',
          });
        }
      }
    } catch (_) {
      // Microlink failed — fall through to manual fetch
    }

    // --- Step 2: Manual HTML metadata fetch as fallback ---
    const res = await fetch(fetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 });
    }

    const html = await res.text();

    let title = getMetaTag(html, 'og:title') || getMetaTag(html, 'twitter:title') || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || fetchUrl;
    let description = getMetaTag(html, 'og:description') || getMetaTag(html, 'twitter:description') || getMetaTag(html, 'description') || '';
    let image = getMetaTag(html, 'og:image') || getMetaTag(html, 'twitter:image') || '';
    const favicon = `${new URL(fetchUrl).origin}/favicon.ico`;

    title = title.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
    description = description.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();

    // Handle relative image URLs
    if (image && !image.startsWith('http')) {
      try {
        const urlObj = new URL(fetchUrl);
        image = `${urlObj.protocol}//${urlObj.host}${image.startsWith('/') ? '' : '/'}${image}`;
      } catch (_) {
        image = '';
      }
    }

    // Use screenshotone as a last-resort screenshot fallback (no key needed for basic)
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(fetchUrl)}&screenshot=true&embed=screenshot.url`;

    return NextResponse.json({
      url: fetchUrl,
      title,
      description,
      image,
      favicon,
      screenshot: screenshotUrl,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to parse URL' }, { status: 500 });
  }
}
