/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly NEXT_PUBLIC_API_BASE_URL?: string;
  readonly VITE_DOMAIN_BASE_URL?: string;
  readonly NEXT_PUBLIC_DOMAIN_BASE_URL?: string;
  readonly VITE_DOMAIN?: string;
  readonly NEXT_PUBLIC_DOMAIN?: string;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
