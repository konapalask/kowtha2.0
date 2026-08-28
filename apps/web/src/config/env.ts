// Central Environment Configuration for Vite + React
export const getEnv = (key: string, defaultValue = ''): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env[key]) return import.meta.env[key];
    if (import.meta.env[`VITE_${key}`]) return import.meta.env[`VITE_${key}`];
    if (import.meta.env[`NEXT_PUBLIC_${key}`]) return import.meta.env[`NEXT_PUBLIC_${key}`];
  }
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) return process.env[key] as string;
    if (process.env[`VITE_${key}`]) return process.env[`VITE_${key}`] as string;
    if (process.env[`NEXT_PUBLIC_${key}`]) return process.env[`NEXT_PUBLIC_${key}`] as string;
  }
  return defaultValue;
};

export const API_BASE_URL = getEnv('API_BASE_URL', 'https://api.cakowtha.co.in/api/');
export const DOMAIN_BASE_URL = getEnv('DOMAIN_BASE_URL', window.location.origin);
export const DOMAIN = getEnv('DOMAIN', window.location.hostname);
