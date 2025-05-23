import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'], // Gunakan bobot regular dan bold
});

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#EDC043] to-[#ED9C40] text-black">
      <div className="container mx-auto py-10 px-8 sm:px-16">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center lg:items-start">
            <Link href="/"><Image src="/logo.png" alt="Logo" width={120} height={120} /></Link>
            <h1 className={`${poppins.className} font-bold text-lg mt-2`}>Cimahpar Quail Farm</h1>
          </div>

          {/* Text Section */}
          <div className="text-center lg:text-left lg:w-2/3">
            <p className={`${poppins.className} font-bold text-sm leading-relaxed`}>
            Cimahpar Quail Farm adalah peternakan burung puyuh yang berlokasi di kawasan asri Cimahpar, Bogor, yang dikenal akan dedikasinya dalam menghasilkan produk unggas berkualitas tinggi. Kami berkomitmen untuk menyediakan berbagai hasil ternak terbaik, 
            mulai dari telur puyuh segar yang kaya gizi, daging puyuh yang sehat dan lezat, hingga produk sampingan peternakan lainnya, semuanya diproses dengan standar kebersihan dan kesehatan yang ketat.            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black my-4"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <p className={`${poppins.className} text-sm`}>
            © 2025 <span className="font-bold">Cimahpar Quail Farm</span> by AR3
          </p>
          
        </div>
      </div>
    </footer>
  );
}
