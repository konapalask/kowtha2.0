const isBrowser = typeof window !== 'undefined';

// console.log(isBrowser)

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
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }
  return null; // Return null if the cookie is not found
}

export function clearAllCookies(): void {
  if (!isBrowser) return;
  const cookies = document.cookie.split("; ");
  const mainDomainUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || '';
  const mainDomain = extractDomainFromUrl(mainDomainUrl);
  for (const cookie of cookies) {
    const [name, _] = cookie.split("=");
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.${process.env.NEXT_PUBLIC_DOMAIN}; path=/`;
  }
}

export function extractDomainFromUrl(url: string): string | null {
  // Use a regular expression to match and extract the domain
  const match = url.match(
    /^(?:https?:\/\/)?(?:[^@/\n]+@)?(?:www\.)?([^:/\n]+)/i
  );

  // Check if there was a match and return the domain
  if (match) {
    return match[1];
  } else {
    return null; // Return null if the URL is invalid or doesn't contain a domain
  }
}

export function setCookie(cookieName: string, cookieValue: string, domain: string, path: string): void {
  if (!isBrowser) return;
  document.cookie = `${cookieName}=${cookieValue}; domain=${domain}; path=${path}`;
}

export function deleteCookie(name: string, domain?: string): void {
  if (!isBrowser) return;
  const currentDomain = domain ? domain : window.location.hostname;
  if (document.cookie.includes(name + "=")) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.${currentDomain}; path=/`;
    console.log("Cookie with name " + name + " has been removed.");
  } else {
    console.log("Cookie with name " + name + " does not exist.");
  }
}
