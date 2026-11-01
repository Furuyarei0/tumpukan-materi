const URL_PATTERN = /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+/gi;

export function splitLinks(text) {
  const parts = [];
  let cursor = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0;
    const rawUrl = match[0];
    const linkText = rawUrl.replace(/[.,!?;:)\]}]+$/u, "");
    if (!linkText) continue;

    const href = /^www\./iu.test(linkText) ? `https://${linkText}` : linkText;
    let url;
    try {
      url = new URL(href);
    } catch {
      continue;
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") continue;
    if (start > cursor) parts.push({ type: "text", value: text.slice(cursor, start) });
    parts.push({ type: "link", value: linkText, href: url.href });
    cursor = start + linkText.length;
  }

  if (cursor < text.length) parts.push({ type: "text", value: text.slice(cursor) });
  return parts;
}
