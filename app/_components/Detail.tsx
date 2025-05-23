"use client";
import { Poppins } from 'next/font/google';
import { useState } from "react";


const poppR = Poppins({
  subsets: ['latin'],
  weight: '400',
});

const poppB = Poppins({
  subsets: ['latin'],
  weight: '700',
});

export function Detail() {
    const images = [
        "/image.png",
        "/galeri1.jpeg",
        "/gallery3.jpg"
    ];
    const [current, setCurrent] = useState(0);

    const nextImage = () => setCurrent((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

    return (
        <>
        <div className="bg-[#EDB943] min-h-screen p-10 mt-28 pb-36">
            <div className="grid grid-cols-3 grid-rows-2 gap-8 max-w-6xl mx-auto mt-8">
                {/* About Us - lebih lebar */}
                <div className="bg-white rounded-xl p-8 flex flex-col  justify-between col-span-2 row-span-1">
                    <h2 className={`${poppR.className} text-4xl text-black`}>
                        <span className="font-bold">TENTANG</span> KAMI
                    </h2>
                    <p className={`${poppR.className} text-black text-xl text-justify mt-2 mb-8 font-semibold`}>
                    Cimahpar Quail Farm menyediakan produk burung puyuh berkualitas, mulai dari telur puyuh segar yang kaya protein dan dipercaya membantu meningkatkan stamina serta kesehatan mata. Selain itu, tersedia juga puyuh potong yang rendah lemak dan baik untuk memenuhi kebutuhan asupan protein hewani keluarga. Dengan standar peternakan higienis, Cimahpar Quail Farm berkomitmen menghadirkan produk puyuh sehat dan bernutrisi untuk mendukung gaya hidup sehat pelanggan.</p>
                </div>
                {/* Contact Us */}
                <div className="bg-white rounded-xl p-8 flex flex-col items-center justify-center col-span-1 row-span-1">
                    <h2 className={`${poppR.className} text-4xl mb-4 text-black`}>
                        <span className="font-bold">KONTAK</span> KAMI
                    </h2>
                    <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white px-6 py-2 rounded-full flex items-center gap-2 font-semibold shadow hover:bg-green-600 transition"
                    >
                        <svg width="20" height="20" fill="currentColor" className="inline-block"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                        Obrolan via WhatsApp
                    </a>
                </div>
                {/* Gallery */}
                <div
                    className="rounded-xl p-8 flex flex-col justify-between relative bg-center bg-cover transition-all duration-300 col-span-1 row-span-1"
                    style={{
                        backgroundImage: `url(${images[current]})`,
                        minHeight: '400px'
                    }}
                >
                    {/* Tombol kiri */}
                    <button
                        className="absolute top-1/2 -translate-y-1/2 left-4 text-2xl text-black rounded-full w-10 h-10 flex items-center justify-center z-10"
                        onClick={prevImage}
                    >{'<'}</button>
                    {/* Tombol kanan */}
                    <button
                        className="absolute top-1/2 -translate-y-1/2 right-4 text-2xl text-black  rounded-full w-10 h-10 flex items-center justify-center z-10"
                        onClick={nextImage}
                    >{'>'}</button>
                    {/* Label Galeri */}
                    <div className={`${poppB.className} text-2xl font-bold mt-auto text-black bg-white/70 px-4 py-1 rounded-lg w-fit absolute left-4 bottom-4`}>
                        GALERI
                    </div>
                </div>
                {/* Maps */}
                <div className="rounded-xl p-0 flex flex-col items-center justify-between col-span-2 row-span-1 h-[400px] overflow-hidden relative">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.024282964839!2d106.849202!3d-6.6059309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c73952e4ea1b%3A0x3c3d2db4f390041e!2sCimahpar%20Quail%20Farm!5e0!3m2!1sid!2sid!4v1717742345678!5m2!1sid!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                    ></iframe>
                    <div className={`${poppB.className} text-black text-2xl font-bold absolute right-6 bottom-6 bg-white/90 px-4 py-1 rounded-lg shadow-lg`}>
                        LOKASI
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};