import Head from 'next/head';
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';
import { NextSeo } from 'next-seo';

export default function Home() {
  return (
    <div className="text-black bg-black">
      <NextSeo
        title="Home: Flux Daily"
        description="Welcome to Flux Daily homepage."
        // canonical="https://nine4-3.vercel.app/"
        // openGraph={{
        //   url: "https://nine4-3.vercel.app/",
        // }}
      />
      <Head>
        <title>Flux Daily</title>
        <link rel="icon" href="/images/flux-small.png" />
      </Head>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
