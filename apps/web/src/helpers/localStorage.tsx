import { DOMAIN, DOMAIN_BASE_URL } from "@/config/env";

const isBrowser = typeof window !== 'undefined';

export const setItem = (key: string, value: string | object, isObject = false): void => {
  if (!isBrowser) return;
  const data = isObject ? JSON.stringify(value) : value;
  localStorage.setItem(key, data as string);
};

export const getItem = (key: string, isObject = false): string | object | null => {
  if (!isBrowser) return null;
  const value = localStorage.getItem(key);
  if (value === null) return null;
  const data = isObject ? JSON.parse(value) : value;
  return data;
};

export const clear = (): void => {
  if (!isBrowser) return;
  localStorage.clear();
};

export const removeItem = (key: string): void => {
  if (!isBrowser) return;
  localStorage.removeItem(key);
};

export function getCookie(cookieName: string): string | null {
  if (!isBrowser) return null;
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === cookieName && value !== undefined) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export function setCookie(name: string, value: string, domain?: string, path = '/'): void {
  if (!isBrowser) return;
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  let domainPart = '';
  if (!isLocal) {
    const targetDomain = (domain || DOMAIN || '').replace(/^\./, '');
    if (targetDomain && hostname.endsWith(targetDomain) && !targetDomain.endsWith('vercel.app')) {
      domainPart = `; domain=.${targetDomain}`;
    }
  }
  document.cookie = `${name}=${encodeURIComponent(value)}; path=${path}${domainPart}; max-age=2592000; SameSite=Lax`;
}

export function clearAllCookies(): void {
  if (!isBrowser) return;
  const cookies = document.cookie.split("; ");
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  const targetDomain = (DOMAIN || '').replace(/^\./, '');
  const domainPart = (!isLocal && targetDomain && hostname.endsWith(targetDomain) && !targetDomain.endsWith('vercel.app'))
    ? `; domain=.${targetDomain}`
    : '';

  for (const cookie of cookies) {
    const [name] = cookie.split("=");
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      if (domainPart) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC${domainPart}; path=/;`;
      }
    }
  }
}

export function extractDomainFromUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /^(?:https?:\/\/)?(?:[^@/\n]+@)?(?:www\.)?([^:/\n]+)/i
  );
  if (match) {
    return match[1];
  }
  return null;
}
