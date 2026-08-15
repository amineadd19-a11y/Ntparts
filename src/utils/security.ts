/** Security utilities for XSS protection and input sanitization */
import DOMPurify from 'isomorphic-dompurify';

export const sanitizeInput = (input: string): string => DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
export const sanitizeHTML = (html: string): string => DOMPurify.sanitize(html);
export const sanitizeURL = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString();
  } catch { return null; }
};
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};
