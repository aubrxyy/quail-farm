'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  gambar: string;
  harga: number;
  description: string;
  stok: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_FILTERS = [
  { value: 'quail-eggs', label: 'Quail Eggs' },
  { value: 'processed-food', label: 'Processed Food' },
  { value: 'fresh-products', label: 'Fresh Products' },
  { value: 'others', label: 'Others' }
];

const STOCK_FILTERS = [
  { value: 'in-stock', label: 'In Stock' },
  { value: 'low-stock', label: 'Low Stock (< 10)' },
  { value: 'out-of-stock', label: 'Out of Stock' }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryFilters, stockFilter, sortBy, searchTerm]);

  async function fetchProducts() {
    try {
      setLoading(true);
      if (searchTerm) setSearching(true);
      
      const params = new URLSearchParams();
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      let data = await response.json();

      // Apply client-side filters
      if (selectedCategoryFilters.length > 0) {
        data = data.filter((product: Product) => {
          // This would need to be adjusted based on how categories are stored
          // For now, using product name to determine category
          const productName = product.name.toLowerCase();
          return selectedCategoryFilters.some(filter => {
            switch (filter) {
              case 'quail-eggs':
                return productName.includes('egg') || productName.includes('telur');
              case 'processed-food':
                return productName.includes('processed') || productName.includes('olahan');
              case 'fresh-products':
                return productName.includes('fresh') || productName.includes('segar');
              default:
                return true;
            }
          });
        });
      }

      if (stockFilter !== 'all') {
        data = data.filter((product: Product) => {
          switch (stockFilter) {
            case 'in-stock':
              return product.stok > 10;
            case 'low-stock':
              return product.stok > 0 && product.stok <= 10;
            case 'out-of-stock':
              return product.stok === 0;
            default:
              return true;
          }
        });
      }

      // Apply sorting
      data.sort((a: Product, b: Product) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price-low':
            return a.harga - b.harga;
          case 'price-high':
            return b.harga - a.harga;
          case 'stock':
            return b.stok - a.stok;
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }

  async function deleteProduct(productId: number) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Refresh products
      await fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  }

  function toggleCategoryFilter(filterValue: string) {
    setSelectedCategoryFilters(prev => {
      if (prev.includes(filterValue)) {
        return prev.filter(f => f !== filterValue);
      } else {
        return [...prev, filterValue];
      }
    });
  }

  function resetAllFilters() {
    setSelectedCategoryFilters([]);
    setStockFilter('all');
    setSortBy('newest');
  }

  function hasActiveFilters() {
    return selectedCategoryFilters.length > 0 || stockFilter !== 'all' || sortBy !== 'newest' || searchTerm;
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  function getStockStatus(stock: number) {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= 10) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  }

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-48"></div>
          <div className="h-16 bg-white rounded-lg"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products Management</h1>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              {searching && (
                <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {products.length === 0 
                ? `No products found for "${searchTerm}"`
                : `Found ${products.length} product${products.length !== 1 ? 's' : ''} for "${searchTerm}"`
              }
            </p>
          )}
        </div>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg p-6 mb-6 space-y-4 shadow max-w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#2d2d2d" strokeWidth="2" />
              <rect x="10" y="7" width="4" height="2" fill="#2d2d2d" />
              <rect x="8" y="11" width="8" height="2" fill="#2d2d2d" />
              <rect x="11" y="15" width="2" height="2" fill="#2d2d2d" />
            </svg>
            <span className="font-medium">Filter & Sort</span>
          </div>
          
          {hasActiveFilters() && (
            <button 
              onClick={resetAllFilters}
              className="flex items-center gap-2 text-red-600 font-medium hover:underline"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Reset All Filters
            </button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Category (Select multiple)</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map(categoryOption => (
              <button
                key={categoryOption.value}
                onClick={() => toggleCategoryFilter(categoryOption.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategoryFilters.includes(categoryOption.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoryOption.label}
              </button>
            ))}
          </div>
          {selectedCategoryFilters.length > 0 && (
            <div className="text-xs text-gray-500">
              Selected: {selectedCategoryFilters.map(f => CATEGORY_FILTERS.find(d => d.value === f)?.label).join(', ')}
            </div>
          )}
        </div>

        {/* Other Filters */}
        <div className="flex gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Stock Status</label>
            <div className="space-y-3">
              <select 
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="all">All Stock Levels</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Sort By</label>
            <div className="space-y-3">
              <select 
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
                <option value="stock">Stock High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters() && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-blue-700">
              <span className="font-medium">Active filters:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {selectedCategoryFilters.map(filter => (
                  <span key={filter} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {CATEGORY_FILTERS.find(d => d.value === filter)?.label}
                    <button 
                      onClick={() => toggleCategoryFilter(filter)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {stockFilter !== 'all' && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Stock: {stockFilter.replace('-', ' ')}
                    <button 
                      onClick={() => setStockFilter('all')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {sortBy !== 'newest' && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Sort: {sortBy.replace('-', ' ')}
                    <button 
                      onClick={() => setSortBy('newest')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Search: "{searchTerm}"
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table - Only this scrolls horizontally */}
      <div className="bg-white rounded-lg shadow overflow-hidden max-w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const stockStatus = getStockStatus(product.stok);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          {product.gambar ? (
                            <img 
                              className="h-16 w-16 rounded object-cover border" 
                              src={product.gambar} 
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: #{product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {product.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(product.harga)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stok} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(product.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {hasActiveFilters() ? 'No products match your current filters.' : 'No products found.'}
            </p>
            {hasActiveFilters() && (
              <button 
                onClick={resetAllFilters}
                className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination info */}
      <div className="flex justify-between items-center mt-6 max-w-full">
        <div className="text-gray-500 text-sm">
          Showing {products.length > 0 ? '1' : '0'}-{products.length} of {products.length}
          {hasActiveFilters() && ' (filtered)'}
        </div>
      </div>
    </div>
  );
}