"use client"

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Icon } from '@iconify/react';
import { Inter } from 'next/font/google';
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";


const interM = Inter({
  subsets: ['latin'],
  weight: '500',
});

const interR = Inter({
  subsets: ['latin'],
  weight: '400',
});

const navigation = [
  { name: "Cart", href: "/cart" },
  { name: "User", href: "/user" }
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const controlHeader = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader);

      return () => {
        window.removeEventListener('scroll', controlHeader);
      };
    }
  }, [controlHeader]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      router.push(`/catalog?search=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const renderProfileItem = () => {
    if (profileImage) {
      return (
        <Link href="/user" className="relative flex items-center">
          <Image src={profileImage} alt="Profile" width={32} height={32} className="rounded-full object-fill size-7" />
        </Link>
      );
    } else if (userName) {
      const firstLetter = userName.charAt(0).toUpperCase();
      return (
        <Link href="/user" className="relative flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-500 to-green-500 rounded-full text-white">
            {firstLetter}
          </div>
        </Link>
      );
    } else {
      return (
        <Link href="/login" className="relative flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-dgreen rounded-full text-yellow-900">
            <Icon icon="carbon:user" width={28} height={28}/>
          </div>
        </Link>
      );
    }
  };

  return (
    <Disclosure as="nav" className={`z-[1000] sticky top-0 bg-white transition-transform duration-300 shadow-md ${interM.className} ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
      {({ open }) => (
        <>
          <div className="z-100 mx-auto max-w-[95%] px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center xl:hidden">
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-[#997950] hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#3A1F04]">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    <Image src="/logo.png" alt="Logo" width={150} height={500} className="my-4 flex items-center justify-center text-center" />
                  </Link>
                </div>
                <div className="hidden lg:ml-auto mr-8 xl:block my-auto">
                  <div className="flex space-x-8">
                    {user ? (
                      <>
                        <Link href="/cart" className="flex items-center justify-center w-8 h-8">
                          <Icon icon="mdi:cart" className="text-[#6B3C10] transition duration-200" width={30} height={30} />
                        </Link>
                        <Link href="/user" className="flex items-center justify-center w-8 h-8">
                          <Icon icon="mdi:account" className="text-[#6B3C10] transition duration-200" width={30} height={30} />
                        </Link>
                        <button onClick={handleLogout} className="flex items-center justify-center w-8 h-8">
                          <Icon icon="mdi:logout" className="text-[#6B3C10]  transition duration-200" width={30} height={30} />
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="border border-solid border-[ED9C40] text-[#6B3C10] px-4 py-2 rounded-full font-medium">Masuk</Link>
                        <Link href="/register" className="bg-[#ED9C40] text-[#6B3C10] px-4 py-2 rounded-full font-bold">Daftar</Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DisclosurePanel className="xl:hidden">
            <div className="mt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={`${
                    item.href === '/' ? pathname === item.href : pathname.startsWith(item.href)
                      ? "bg-[#3A1F04] text-white"
                      : "text-gray-500 hover:text-white hover:bg-gray-400 max-lg:active:text-black text-nowrap"
                  } text-xl block py-2 px-8 ${interM.className}`}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            <div className="w-full bg-[#997950] h-1"></div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}