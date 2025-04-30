import { Poppins } from 'next/font/google';
import Link from 'next/link'; // Tambahkan ini di bagian atas file
import Image from 'next/image';

const poppR = Poppins({
  subsets: ['latin'],
  weight: '400',
});

const poppB = Poppins({
  subsets: ['latin'],
  weight: '700',
});

export function Hero() {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-[#E6DCB8] min-h-screen w-full flex flex-col items-start justify-center px-4 lg:px-0">
        <h1
          style={{ fontFamily: 'Milker, sans-serif' }}
          className="text-4xl lg:text-4xl text-black leading-tight max-w-xl text-left mt-20 mb-20 ml-40"
        >
          DARI CIMAHPAR, PUYUH BERKUALITAS UNTUK MEJA MAKAN ANDA
        </h1>

        {/* Products Section */}
        <div className="bg-cover mt-10 rounded-t-[100px] py-12 px-6 w-full max-w-6xl mx-auto" style={{ backgroundImage: "url('/egg1.png')" }}>
          <h2
            style={{ fontFamily: 'Milker, sans-serif' }} className= "text-4xl lg:text-7xl text-[#EDC043] text-center"
          >
            PRODUK KAMI
          </h2>
          <p className={`${poppR.className} text-sm text-[#6B3C10] mt-2 text-center`}>
            Dipilih secara langsung untuk kualitas terbaik
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {/* Product 1 */}
            <div className="flex flex-col items-center bg-[#6B3C10] rounded-2xl shadow-lg p-4 w-[15rem]">
              <Image
                src="/telurpuyuh.png"
                alt="Telur Puyuh"
                width={150}
                height={150}
                className="mx-auto mb-4"
              />
              <h3 className="text-white text-4xl font-bold text-center" style={{ fontFamily: 'Milker, sans-serif' }}>
                TELUR PUYUH
              </h3>
              <p className={`${poppB.className} text-6xl text-[#EDC043] mt-2 mb-4`}>
                40k
                <span className={`${poppR.className} inline-block text-sm text-[#EDC043]`}>/kg</span>
              </p>
              <button className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-white hover:text-[#6B3C10] transition duration-300">
                <Link href="/telur"> {/* Ganti dengan path yang sesuai */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </button>
            </div>

            {/* Product 2 */}
            <div className="flex flex-col items-center bg-[#6B3C10] rounded-2xl shadow-lg p-4 w-[15rem]">
              <Image
                src="/puyuh.png"
                alt="Puyuh"
                width={200}
                height={200}
                className="mx-auto mb-4"
              />
              <h3 className="text-white text-4xl font-bold text-center" style={{ fontFamily: 'Milker, sans-serif' }}>
                BURUNG PUYUH
              </h3>
              <p className={`${poppB.className} text-6xl text-[#EDC043] mt-2 mb-4`}>
                30k
                <span className={`${poppR.className} inline-block text-sm text-[#EDC043]`}>/ekor</span>
              </p>
              <button className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-white hover:text-[#6B3C10] transition duration-300">
                <Link href={"/puyuh"}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </button>
            </div>

            {/* Product 3 */}
            <div className="flex flex-col items-center bg-[#6B3C10] rounded-2xl shadow-lg p-4 w-[15rem]">
              <Image
                src="/puyuhptng.png"
                alt="Puyuh Potong"
                width={600}
                height={600}
                className="mx-auto mb-6"
              />
              <h3 className="text-white text-4xl text-center font-bold" style={{ fontFamily: 'Milker, sans-serif' }}>
                PUYUH POTONG
              </h3>
              <p className={`${poppB.className} text-6xl text-[#EDC043] mt-2 mb-4`}>
                35k
                <span className={`${poppR.className} inline-block text-sm text-[#EDC043]`}>/kg</span>
              </p>
              <button className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-white hover:text-[#6B3C10] transition duration-300">
                <Link href={"/puyuhptng"}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
