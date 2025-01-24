import { useEffect, useRef } from 'react';

export default function Main() {
  const VideoComponent = () => {
    const videoRef = useRef(null);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 0.8;
      }
    }, []);

    return (
      <video ref={videoRef} className="w-full h-auto" autoPlay loop muted>
        <source src="/videos/hero2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  };
  return (
    <section className="text-gray-600 body-font">
      <div className="center absolute z-0 w-full">
        <div className="absolute bg-black w-full h-full opacity-60" />
        <VideoComponent />
        <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-gradient-to-t from-black to-transparent"></div>
      </div>
      <div className="z-10 relative">
        <div className="max-w-5xl pt-52 pb-24 mx-auto ">
          <h1 className="text-[60px] text-center font-4 lh-6 ld-04 font-bold text-white mb-6">
            AI-Driven Cryptocurrency News
          </h1>
          <h2 className="text-2xl font-4 font-semibold lh-6 ld-04 pb-11 text-gray-300 text-center">
            Harness the Power of AI to Stay Ahead in Crypto: Real-Time News,
            Market Trends, and Data-Driven Analysis at Your Fingertips
          </h2>
          <div className="ml-6 text-center">
            <div className="relative inline-flex items-center cursor-pointer">
              <a
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-800 px-14 py-3 font-semibold tracking-tighter text-white transition-transform duration-1000 ease-in-out transform hover:scale-105 focus:shadow-outline"
                href="/"
              >
                <div className="flex text-lg">
                  <span className="justify-center">Get Started</span>
                </div>
              </a>
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-200 rounded-lg"></div>
            </div>
          </div>
        </div>
        <p className="mx-auto text-xl text-center text-gray-300 font-normal leading-relaxed fs521 lg:w-2/3 mt-10">
          Your Gateway to Real-Time Crypto Insights
        </p>
        <div className="pt-12 pb-24 max-w-5xl mx-auto fsac4 md:px-1 px-3">
          <div className="ktq4 relative overflow-hidden backdrop-blur-xl">
            {/* <div className="absolute left-0 top-0">
              <img className="w-16" src="/images/news1.png" />
              <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-gradient-to-tl from-black to-transparent"></div>
            </div> */}
            <h3 className="font-semibold text-lg text-white flex">
              <img src="/images/news.svg" className="w-6 h-6 mr-3" />
              Stay Ahead with Real-Time Crypto News
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Use advanced AI to curate and deliver the latest and hottest
              cryptocurrency news from Twitter, keeping you updated and informed
              in real-time
            </p>
          </div>
          <div className="ktq4">
            <h3 className="font-semibold text-lg text-white flex">
              <img src="/images/bitcoin.svg" className="w-6 h-6 mr-3" />
              Empowering Transactions with Flux Coin
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Use Flux Coin to engage with exclusive news content, creating a
              seamless and innovative way to connect with crypto trends
            </p>
          </div>
          <div className="ktq4">
            <h3 className="font-semibold text-lg text-white flex">
              <img src="/images/graph.svg" className="w-6 h-6 mr-3" />
              AI-Driven Insights at Your Fingertips
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Discover the power of AI to analyze and highlight critical market
              shifts, empowering you to make smarter decisions
            </p>
          </div>
          <div className="ktq4">
            <h3 className="font-semibold text-lg text-white flex">
              <img src="/images/exchange.svg" className="w-6 h-6 mr-3" />
              Trade Flux News
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Upload the latest and hottest cryptocurrency news and let others
              discover it! Every time your news is purchased, you'll earn Flux
              coins, turning your insights into real value.
            </p>
          </div>
        </div>
        <div className="pt-32 pb-32 max-w-6xl mx-auto fsac4 md:px-1 px-3">
          <div className="ktq4">
            <h3 className="font-semibold text-lg text-white">
              O copinho eu quero te ver contente
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Derramando bebida na sua mente <br />
              Porque só o coração apaixonado sente <br />
              Não abandona o piru da gente
            </p>
          </div>
          <div className="ktq4">
            <h3 className="font-semibold text-lg text-white">
              O copinho eu quero te ver contente
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Derramando bebida na sua mente <br />
              Porque só o coração apaixonado sente <br />
              Não abandona o piru da gente
            </p>
          </div>
        </div>
        <section className="relative pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <div className="py-24 md:py-36">
              <h1 className="mb-5 text-6xl font-bold text-white">
                Subscribe to our newsletter
              </h1>
              <h1 className="mb-9 text-2xl font-semibold text-gray-200">
                Enter your email address and get our newsletters straight away.
              </h1>
              <input
                type="email"
                placeholder="satoshi@nakamoto.com"
                name="email"
                autoComplete="email"
                className="border border-gray-600 w-1/4 pr-2 pl-2 py-3 mt-2 rounded-m font-semibold hover:border-gray-700 bg-black text-white"
              />{' '}
              <a
                className="inline-flex items-center px-14 py-3 mt-2 ml-2 font-medium text-black transition duration-500 ease-in-out transform bg-transparent border rounded-lg bg-white"
                href="/"
              >
                <span className="justify-center">Subscribe</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
