import React from 'react';
import {
  useNavigate,
  useLocation,
  useParams,
  Link as RouterLink,
} from 'react-router-dom';

export interface UrlObject {
  pathname: string;
  query?: Record<string, any>;
}

export type RouteInput = string | UrlObject;

export interface AppRouter {
  pathname: string;
  asPath: string;
  query: Record<string, string | undefined>;
  isReady: boolean;
  push: (url: RouteInput, as?: any, options?: any) => Promise<boolean>;
  replace: (url: RouteInput, as?: any, options?: any) => Promise<boolean>;
  back: () => void;
  reload: () => void;
}

const formatUrl = (url: RouteInput): string => {
  if (typeof url === 'string') return url;
  if (!url.query || Object.keys(url.query).length === 0) return url.pathname;
  const searchParams = new URLSearchParams();
  Object.entries(url.query).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      searchParams.set(key, String(val));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `${url.pathname}?${queryString}` : url.pathname;
};

export function useRouter(): AppRouter {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const searchParams = new URLSearchParams(location.search);
  const queryParams: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    queryParams[key] = val;
  });

  const query = {
    ...queryParams,
    ...params,
  };

  return {
    pathname: location.pathname,
    asPath: location.pathname + location.search,
    query,
    isReady: true,
    push: (url: RouteInput) => {
      const target = formatUrl(url);
      navigate(target);
      return Promise.resolve(true);
    },
    replace: (url: RouteInput) => {
      const target = formatUrl(url);
      navigate(target, { replace: true });
      return Promise.resolve(true);
    },
    back: () => navigate(-1),
    reload: () => window.location.reload(),
  };
}

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href?: string;
  to?: string;
  children?: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, to, children, ...props }) => {
  const target = to || href || '/';
  return (
    <RouterLink to={target} {...(props as any)}>
      {children}
    </RouterLink>
  );
};

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: any;
  alt?: string;
  width?: number | string;
  height?: number | string;
}

export const Image: React.FC<ImageProps> = ({ src, alt = '', width, height, className, style, ...props }) => {
  const resolvedSrc = typeof src === 'object' && src !== null ? src.src || src.default || '' : src;
  return (
    <img
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      {...props}
    />
  );
};
