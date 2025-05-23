'use client'
import { Icon } from '@iconify/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const AdminNavbar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block h-screen fixed top-0 left-0">
        <div className="h-screen bg-egg-white pr-4 text-black pt-24 relative flex flex-col font-medium ">
          <nav className="flex-1 ">
            <ul className='flex flex-col '>
              <li>
                <Link
                  href="/admin/dashboard"
                  className={`items-center flex flex-row py-3 pl-8 pr-16 text-sm hover:bg-gradient-to-b hover:bg-yellow-100 rounded-r-xl transition-all ${pathname.startsWith ('/admin/dashboard') ? 'bg-gradient-to-br from-yellow-start to-yellow-end' : ''}`}
                >
                <Icon icon="la:tachometer-alt" className='mr-6 size-7' />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/products"
                  className={`items-center flex flex-row py-3 pl-8 pr-16 text-sm hover:bg-gradient-to-b hover:bg-yellow-100 rounded-r-xl transition-all ${pathname.startsWith('/admin/products') ? 'bg-gradient-to-br from-yellow-start to-yellow-end' : ''}`}
                >
                  <Icon icon="la:th-large" className='mr-6 size-7' />
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/orders"
                  className={`items-center flex flex-row py-3 pl-8 pr-16 text-sm hover:bg-gradient-to-b hover:bg-yellow-100 rounded-r-xl transition-all ${pathname.startsWith ('/admin/orders') ? 'bg-gradient-to-br from-yellow-start to-yellow-end' : ''}`}
                >
                  <Icon icon="la:list-alt" className='mr-6 size-7' />
                  Order List
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/finances"
                  className={`items-center flex flex-row py-3 pl-8 pr-16 text-sm hover:bg-gradient-to-b hover:bg-yellow-100 rounded-r-xl transition-all ${pathname.startsWith ('/admin/finances') ? 'bg-gradient-to-br from-yellow-start to-yellow-end' : ''}`}
                >
                  <Icon icon="material-symbols:finance-mode" className='mr-6 size-7' />
                  Finances
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/employees"
                  className={`items-center flex flex-row py-3 pl-8 pr-16 text-sm hover:bg-gradient-to-b hover:bg-yellow-100 rounded-r-xl transition-all ${pathname.startsWith ('/admin/employees') ? 'bg-gradient-to-br from-yellow-start to-yellow-end' : ''}`}
                >
                  <Icon icon="ic:baseline-person" className='mr-6 size-7' />
                  Employees
                </Link>
            </li>
            <hr className='mt-4 opacity-20'/>
              <li>
                <Link
                  href="/logout"
                  className={`items-center flex flex-row mt-4 py-3 pl-8 pr-16 text-sm text-red-600 hover:bg-gradient-to-b hover:bg-yellow-100 rounded-r-xl transition-all ${pathname.startsWith ('/admin/logout') ? 'bg-gradient-to-br from-yellow-start to-yellow-end' : ''}`}
                >
                  <Icon icon="quill:off" className='pl-1 mr-6 size-6' />
                  Log out
                </Link>
              </li>
              
              
            </ul>
          </nav>
      </div>
    </aside>
  );
};

export default AdminNavbar;