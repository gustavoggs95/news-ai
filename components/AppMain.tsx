import { useEffect, useRef } from "react";

export default function AppMain() {
  const VideoComponent = () => {
    const videoRef = useRef(null);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 0.8;
      }
    }, []);

    return (
      <video ref={videoRef} className="w-full h-auto" autoPlay loop muted poster="./images/bg-video-poster.png">
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
          <h1 className="sm:text-[60px] text-[40px] text-center font-4 lh-6 ld-04 font-bold text-white mb-6">
            AI-Driven Cryptocurrency News
          </h1>
          <h2 className="text-2xl font-4 font-semibold lh-6 ld-04 pb-11 text-gray-300 text-center">
            Harness the Power of AI to Stay Ahead in Crypto: Real-Time News, Market Trends, and Data-Driven Analysis at
            Your Fingertips
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
              Use advanced AI to curate and deliver the latest and hottest cryptocurrency news from Twitter, keeping you
              updated and informed in real-time
            </p>
          </div>
          <div className="ktq4">
            <h3 className="font-semibold text-lg text-white flex">
              <img src="/images/bitcoin.svg" className="w-6 h-6 mr-3" />
              Empowering Transactions with Flux Coin
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Use Flux Coin to engage with exclusive news content, creating a seamless and innovative way to connect
              with crypto trends
            </p>
          </div>
          <div className="ktq4">
            <h3 className="font-semibold text-lg text-white flex">
              <img src="/images/graph.svg" className="w-6 h-6 mr-3" />
              AI-Driven Insights at Your Fingertips
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Discover the power of AI to analyze and highlight critical market shifts, empowering you to make smarter
              decisions
            </p>
          </div>
          <div className="ktq4">
            <h3 className="font-semibold text-lg text-white flex">
              <img src="/images/exchange.svg" className="w-6 h-6 mr-3" />
              Trade Flux News
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Upload the latest and hottest cryptocurrency news and let others discover it! Every time your news is
              purchased, you'll earn Flux coins, turning your insights into real value.
            </p>
          </div>
        </div>
        <div className="mt-40 max-w-4xl mx-auto text-center mb-40 relative">
          <h1 className="mb-5 sm:text-[60px] text-[40px] font-bold text-white ">Trade. Learn. Share.</h1>
          <h3 className="mb-16 text-2xl font-semibold text-gray-200 opacity-50">
            Exchange ideas, gain knowledge and share the future of crypto
          </h3>
          <div className="h-[445px]">
            <img
              src="./images/test-card.png"
              className="w-full rotate-card rounded-xl overflow-hidden absolute sm:left-5"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
