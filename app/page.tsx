import localFont from 'next/font/local';
import { Detail } from "./_components/Detail";
import { Footer } from "./_components/Footer";
import Header from "./_components/Header";
import { Hero } from './_components/Hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#E6DCB8] flex flex-col">
      <Header />
      <Hero />
      <Detail />
      <Footer />
    </div>
  );
}
