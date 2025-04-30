import Image from 'next/image';
import { Icon } from '@iconify/react';

export default function AdminHeader() {
  return (
    <header className="px-10 py-1 fixed bg-egg-white top-0 left-0 right-0 flex justify-between items-center text-black z-10">
        <div className="flex items-center">
          <a href='/admin/dashboard' className='px-10'>
            <Image src="/logo.png" alt="Cimahpar Quail Farm" width={100} height={100} />
          </a>
            <div className="relative search-bar ml-20">
                <Icon icon="mynaui:search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 icon" width={20} height={20} />
                <input
                    type="text"
                    className="block w-full pl-10 md:pr-24 lg:pr-96 py-2 bg-white rounded-3xl placeholder-gray-400 sm:text-sm"
                    placeholder="Search"
                />
            </div>
        </div>
        <div>
          [Admin profile]
        </div>
      </header>
  );
}