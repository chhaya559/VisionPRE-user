import { PREVIEW_BASE_URL } from '../Services/Api/Constants';

/**
 * Ensures a URL is absolute by prepending the PREVIEW_BASE_URL if it's a relative path.
 * @param url The URL string to verify.
 * @returns An absolute URL string or null if input is falsy.
 */
export const ensureAbsoluteUrl = (
  url: string | null | undefined
): string | null => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('blob:')) return url; // Support local preview blobs
  if (url.startsWith('data:')) return url; // Support base64

  // Clean the URL and PREVIEW_BASE_URL to avoid double slashes
  const cleanBaseUrl = PREVIEW_BASE_URL.endsWith('/')
    ? PREVIEW_BASE_URL.slice(0, -1)
    : PREVIEW_BASE_URL;
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  return `${cleanBaseUrl}${cleanUrl}`;
};

/**
 * Formats a list (array of strings or string) with commas and spaces.
 * @param value The value to format.
 * @returns A formatted string or the original value if it's not an array.
 */
export const formatList = (
  value: string | string[] | null | undefined
): string => {
  if (!value) return '';
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ');
  }
  return value;
};
