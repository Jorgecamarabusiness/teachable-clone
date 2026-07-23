export function toEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;

      const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/]+)/);
      if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    if (host === "youtu.be") {
      const videoId = parsed.pathname.slice(1);
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host === "vimeo.com") {
      const videoId = parsed.pathname.slice(1);
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }

    if (host === "loom.com") {
      const shareMatch = parsed.pathname.match(/^\/share\/([^/]+)/);
      if (shareMatch) return `https://www.loom.com/embed/${shareMatch[1]}`;
    }

    return url;
  } catch {
    return url;
  }
}
