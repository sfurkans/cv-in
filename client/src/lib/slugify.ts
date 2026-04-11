const TURKISH_REPLACEMENTS: Record<string, string> = {
  ç: 'c',
  Ç: 'C',
  ğ: 'g',
  Ğ: 'G',
  ı: 'i',
  İ: 'I',
  ö: 'o',
  Ö: 'O',
  ş: 's',
  Ş: 'S',
  ü: 'u',
  Ü: 'U',
}

export function slugify(value: string): string {
  return value
    .split('')
    .map((ch) => TURKISH_REPLACEMENTS[ch] ?? ch)
    .join('')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}
