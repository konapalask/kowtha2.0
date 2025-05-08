import type { AppProps } from "next/app";
import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#145886",
            colorPrimaryHover: "#2e6e94",
          },
        }}
      >
        <Component {...pageProps} />
      </ConfigProvider>
    </SessionProvider>
  );
}
