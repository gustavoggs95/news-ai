import { NextSeo } from "next-seo";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Main from "../components/Main";

export default function Home() {
  return (
    <div className="text-black bg-black">
      <NextSeo
        title="Flux"
        description="Welcome to Flux homepage."
        // canonical="https://nine4-3.vercel.app/"
        // openGraph={{
        //   url: "https://nine4-3.vercel.app/",
        // }}
      />
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
