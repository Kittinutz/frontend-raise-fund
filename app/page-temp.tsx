"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section
        className="bg-green-600 h-screen text-white bg-cover pt-12 position-relative"
        style={{
          backgroundImage: "url('/images/section1_bg.webp')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="container max-w-6xl  mx-auto px-4 py-8 space-y-4 z-10 relative flex flex-col  justify-center h-full">
          <h1 className="text-5xl font-bold">
            D&Z Abattoir Capital Reserve Protocol
          </h1>
          <h1 className="text-4xl font-bold">
            Thailand&apos;s Largest Halal Abattoir
          </h1>
          <p className="text-lg max-w-2xl ">
            Institutional-grade fixed returns backed by Thailand&apos;s largest
            halal meat processing operations. Every investment round is secured
            by smart contracts and supported by decades of proven halal industry
            success.
          </p>
          <div className="space-x-4">
            <Link href="/rounds">
              <button className="bg-primary font-bold py-3 px-6 rounded-lg text-white hover:bg-primary/90 transition-colors">
                View Funding Rounds
              </button>
            </Link>
            <Link href="/dapp">
              <button className="bg-white border-2 border-white font-bold py-3 px-6 rounded-lg text-primary hover:bg-gray-50 transition-colors">
                Go to App
              </button>
            </Link>
          </div>
        </div>
      </section>
      <section className="">
        <div className="relative -top-24 container max-w-6xl mx-auto px-4 py-8 space-y-4 z-10 flex flex-col  justify-center h-full">
          <div className="abosolute top-0 left-0 w-full h-full  bg-cover bg-center -z-10">
            {/* <PreviewCurrentProtocol
              currentCapitalReserve={1000000}
              apy={6}
              totalInvestor={6000}
            /> */}
          </div>
        </div>
      </section>

      {/* Funding Rounds Section */}
      <section className="bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Investment Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our current funding rounds and join thousands of investors
              earning fixed returns through our halal-compliant investment
              protocol.
            </p>
          </div>
          {/* <FundingRoundsPreview /> */}
          <div className="text-center mt-8">
            <Link href="/rounds">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                View All Rounds
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="">
        <div className="container  max-w-6xl mx-auto px-4 py-8 space-y-4 z-10 relative flex flex-col  justify-center h-full">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">What you need to know</h2>
              <p className="text-lg max-w-2xl ">
                Ours Reserver Protocol is designed to provide investors with a
                secure and reliable way to earn fixed returns backed by
                Thailand&apos;s largest halal meat processing operations. By
                leveraging smart contract technology, Ours reserves Protocol
                mainly use for buy Cow to support halal meat production and
                processing, ensuring transparency and trust in every investment
                round. With decades of proven success in the halal industry, we
                are committed to delivering consistent returns while upholding
                the highest standards of halal compliance.
              </p>
            </div>
            <div>
              <Image
                src="/images/08979e43-c5ca-4cc3-a109-56e0668f3e81.png"
                alt="Stake"
                layout="responsive"
                width={500}
                height={300}
                className="rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container max-w-6xl mx-auto px-4 py-8 space-y-4 z-10 relative flex flex-col  justify-center h-full">
          <h2 className="text-3xl text-center font-bold">Ours CEO</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex justify-center">
              <Image
                src="/images/ceo.jpg"
                alt="CEO"
                width={300}
                height={300}
                className="rounded-full shadow-md"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Mr. Adul Kamlaithong</h3>
              <div className="space-y-4">
                <p className="text-lg">
                  [Add verified biographical information about Mr. Adul
                  Kamlaithong here]
                </p>
                <div>
                  <h4 className="text-xl font-semibold mb-2">
                    Professional Timeline
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• [Year] - [Position/Achievement]</li>
                    <li>• [Year] - [Position/Achievement]</li>
                    <li>• [Year] - [Position/Achievement]</li>
                  </ul>
                </div>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className=" text-white">
        <div className="container  max-w-6xl mx-auto px-4 py-8 space-y-4 z-10 relative flex flex-col  justify-center h-full">
          <h2 className="text-3xl font-bold text-center text-primary my-6">
            Ours business
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <Image
                src="/images/section4_pic1.webp"
                alt="Abattoir"
                layout="responsive"
                width={500}
                height={300}
              />
              <div className="absolute inset-0 bg-black opacity-15"></div>
            </div>
            <div className="bg-gray-bg p-6 text-black">
              <h3 className="text-2xl font-bold mb-2 text-center">Farm</h3>
              <p className="text-lg max-w-2xl px-4">
                Our cattle are raised in a Good Agricultural Practices (GAP)
                farm, ensuring adherence to the standards and regulations set by
                the Department of Livestock Development (DLD), which are
                endorsed by the World Organization for Animal Health (OIE). Our
                collaborative farms strictly adhere to an animal welfare plan,
                requiring compulsory vaccination of all our cattle against Foot
                and Mouth disease, overseen by qualified Veterinary Doctors.
              </p>
            </div>
            <div className="bg-primary p-6 text-white">
              <h3 className="text-2xl font-bold mb-2 text-center">
                Our Factory
              </h3>
              <p className="text-lg max-w-2xl px-4">
                Our factory is strategically situated in Chumphon, a region in
                southern Thailand renowned for its abundant natural resources
                conducive to cattle raising and farming. This location boasts
                excellent connectivity to both seaports and airports, adding
                significant value to its accessibility.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/images/section4_pic2.webp"
                alt="Abattoir"
                layout="responsive"
                width={500}
                height={300}
              />
              <div className="absolute inset-0 bg-black opacity-15"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
