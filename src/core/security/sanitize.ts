const HTML_TAG_REPLACEMENTS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi,
  /on\w+\s*=\s*(["'][^"']*["']|[\w\W]*?)(?=(?:\s|>|\/))/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi
];

export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  let cleaned = input;

  for (const pattern of HTML_TAG_REPLACEMENTS) {
    cleaned = cleaned.replace(pattern, '');
  }

  return cleaned.trim();
}
