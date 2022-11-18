import "../src/styles/globals.css";
import type { AppProps } from "next/app";
import ContextProviders from "../src/store/providers";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ContextProviders>
      <Component {...pageProps} />
    </ContextProviders>
  );
}

export default MyApp;
