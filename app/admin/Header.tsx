'use client';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function AdminHeader() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize search term from URL params
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchTerm(query);
    } else {
      setSearchTerm('');
    }
  }, [searchParams]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const context = getSearchContext();
      if (term.trim()) {
        router.push(`${context.endpoint}?search=${encodeURIComponent(term.trim())}`);
      } else {
        router.push(context.endpoint);
      }
    }, 300), // 300ms delay
    [pathname]
  );

  // Determine search context based on current page
  function getSearchContext() {
    if (pathname.includes('/admin/products')) {
      return { 
        placeholder: 'Search products...', 
        endpoint: '/admin/products',
        searchType: 'products'
      };
    } else if (pathname.includes('/admin/orders')) {
      return { 
        placeholder: 'Search orders...', 
        endpoint: '/admin/orders',
        searchType: 'orders'
      };
    } else if (pathname.includes('/admin/users')) {
      return { 
        placeholder: 'Search users by name or email...', 
        endpoint: '/admin/users',
        searchType: 'users'
      };
    } else if (pathname.includes('/admin/dashboard')) {
      return { 
        placeholder: 'Search...', 
        endpoint: '/admin/dashboard',
        searchType: 'dashboard'
      };
    } else {
      return { 
        placeholder: 'Search...', 
        endpoint: pathname,
        searchType: 'general'
      };
    }
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const context = getSearchContext();
    
    if (searchTerm.trim()) {
      router.push(`${context.endpoint}?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push(context.endpoint);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchTerm(value);
    // Trigger debounced search as user types
    debouncedSearch(value);
  }

  function clearSearch() {
    setSearchTerm('');
    const context = getSearchContext();
    router.push(context.endpoint);
  }

  const searchContext = getSearchContext();

  return (
    <header className="px-10 py-1 fixed bg-egg-white top-0 left-0 right-0 flex justify-between items-center text-black z-1000">
      <div className="flex items-center">
        <Link href='/admin/dashboard' className='px-10'>
          <Image src="/logo.png" alt="Cimahpar Quail Farm" width={100} height={100} />
        </Link>
        <form onSubmit={handleSearch} className="relative search-bar ml-20">
          <Icon 
            icon="mynaui:search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 icon cursor-pointer hover:text-gray-600 transition-colors" 
            width={20} 
            height={20}
            onClick={() => handleSearch({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            className="block w-full pl-10 md:pr-24 lg:pr-96 py-2 bg-white rounded-3xl placeholder-gray-400 sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder={searchContext.placeholder}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <Icon icon="mdi:close" width={16} height={16} />
            </button>
          )}
          
          {/* Search context indicator with loading state */}
          {searchTerm && (
            <div className="absolute top-full left-0 mt-1 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm border">
              Searching {searchContext.searchType}...
            </div>
          )}
        </form>
      </div>
      <div>
        {/* Your existing header content */}
      </div>
    </header>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}