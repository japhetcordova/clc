import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Robust HTML entity decoder that handles:
 * 1. Named entities (e.g. &rsquo;, &ldquo;)
 * 2. Decimal entities (e.g. &#8217;)
 * 3. Hex entities (e.g. &#x27;)
 */
export function decodeHTMLEntities(text: string | null | undefined): string {
  if (!text) return "";

  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&nbsp;': ' ',
    '&mdash;': '—',
    '&ndash;': '–',
  };

  return text.replace(/&[#\w\d]+;/g, (entity) => {
    const lowerEntity = entity.toLowerCase();
    // 1. Direct match in dictionary
    if (entities[lowerEntity]) return entities[lowerEntity];

    // 2. Hex entities (e.g. &#x27;)
    if (lowerEntity.startsWith('&#x')) {
      const code = parseInt(entity.slice(3, -1), 16);
      return !isNaN(code) ? String.fromCharCode(code) : entity;
    }

    // 3. Decimal entities (e.g. &#8217;)
    if (lowerEntity.startsWith('&#')) {
      const code = parseInt(entity.slice(2, -1), 10);
      return !isNaN(code) ? String.fromCharCode(code) : entity;
    }

    return entity;
  });
}
