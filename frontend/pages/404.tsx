import { NextSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Contact() {
  const router = useRouter();
  return (
    <div className="text-black bg-black">
      <NextSeo
        title="404: Flux"
        description="404 page for all missing pages"
        // canonical="https://nine4-3.vercel.app/404"
        // openGraph={{
        //   url: "https://nine4-3.vercel.app/404",
        // }}
      />
      <Head>
        <title key="title">Flux</title>
        <link key="icon" rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex flex-col justify-center mx-auto mt-52 text-center max-w-2x1">
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">404 – Unavailable</h1>
        <br />
        <div
          className="w-64 p-1 mx-auto font-bold text-center text-white border border-gray-500 rounded-lg sm:p-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          Return Home
        </div>
      </div>
      <div className="mt-64"></div>
      <Footer />
    </div>
  );
}
