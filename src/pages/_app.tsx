import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/theme-provider";
import { IntlProvider } from 'next-intl';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <IntlProvider messages={pageProps.messages} locale={pageProps.locale}>
        <Component {...pageProps} />
      </IntlProvider>
    </ThemeProvider>
  )
}
