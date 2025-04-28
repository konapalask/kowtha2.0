import type { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#85365f',
            colorPrimaryHover: '#9c145a',
          },
        }}
      >
        <Component {...pageProps} />
      </ConfigProvider>
    </SessionProvider>
  );
} 