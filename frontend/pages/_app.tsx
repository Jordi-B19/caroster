import {useEffect} from 'react';
import 'leaflet/dist/leaflet.css';
import '../public/leaflet_reset.css';
import Head from 'next/head';
import {MantineProvider} from '@mantine/core';
import {Notifications} from '@mantine/notifications';
import {AppProps} from 'next/app';
import {appWithTranslation, UserConfig} from 'next-i18next';
import {ApolloProvider} from '@apollo/client';
import {SessionProvider} from 'next-auth/react';
import Metas from '../containers/Metas';
import Toasts from '../components/Toasts';
import theme from '../theme';
import useLocale from '../hooks/useLocale';
import {useApollo} from '../lib/apolloClient';
import nextI18NextConfig from '../next-i18next.config.js';
import moment from 'moment';
import useTolgee from '../hooks/useTolgee';

const App = function (props: AppProps) {
  const {Component, pageProps} = props;
  const apolloClient = useApollo(pageProps);
  const {locale} = useLocale();

  useTolgee();
  moment.locale(locale);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-serverside');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <Metas metas={pageProps.metas} />
      <MantineProvider theme={theme}>
        <Notifications />
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
        </Head>
        <Component {...pageProps} />
        <Toasts />
      </MantineProvider>
    </ApolloProvider>
  );
};

const AppWrapper = (props: AppProps)	=> (
  <SessionProvider session={props?.pageProps.session} basePath="/api/nauth">
    <App {...props} />
  </SessionProvider>
);

export default appWithTranslation(AppWrapper, nextI18NextConfig as UserConfig);
