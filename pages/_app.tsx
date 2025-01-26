import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Flux</title>
        <link rel="icon" href="/images/flux-small.png" />
      </Head>
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
