'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface Product {
  id: number;
  name: string;
  deskripsi: string;
  harga: number;
  stok: number;
  gambar: string;
  slug?: string;
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    stockMin: '',
    stockMax: '',
    stockStatus: 'all' // 'all', 'in-stock', 'out-of-stock', 'low-stock'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Price filters
    if (filters.priceMin) {
      filtered = filtered.filter(p => p.harga >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => p.harga <= Number(filters.priceMax));
    }

    // Stock filters
    if (filters.stockMin) {
      filtered = filtered.filter(p => p.stok >= Number(filters.stockMin));
    }
    if (filters.stockMax) {
      filtered = filtered.filter(p => p.stok <= Number(filters.stockMax));
    }

    // Stock status filter
    if (filters.stockStatus === 'in-stock') {
      filtered = filtered.filter(p => p.stok > 0);
    } else if (filters.stockStatus === 'out-of-stock') {
      filtered = filtered.filter(p => p.stok === 0);
    } else if (filters.stockStatus === 'low-stock') {
      filtered = filtered.filter(p => p.stok > 0 && p.stok <= 10);
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      stockMin: '',
      stockMax: '',
      stockStatus: 'all'
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchProducts();
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex text-black bg-bright-egg-white min-h-screen">
        <div className="px-8 pt-4 flex flex-col gap-y-6 w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-48"></div>
            <div className="h-16 bg-white rounded-lg"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex text-black bg-bright-egg-white min-h-screen">
      <div className="px-8 pt-4 flex flex-col gap-y-6 w-full max-w-full overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <Link
            href="/admin/products/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Product
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={filters.priceMin}
                onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                placeholder="∞"
                value={filters.priceMax}
                onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Stock Range */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Stock</label>
              <input
                type="number"
                placeholder="0"
                value={filters.stockMin}
                onChange={(e) => setFilters({...filters, stockMin: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max Stock</label>
              <input
                type="number"
                placeholder="∞"
                value={filters.stockMax}
                onChange={(e) => setFilters({...filters, stockMax: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Stock Status */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Stock Status</label>
              <select
                value={filters.stockStatus}
                onChange={(e) => setFilters({...filters, stockStatus: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Products</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="low-stock">Low Stock (≤10)</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              {filteredProducts.length !== products.length && (
                <span>Showing {filteredProducts.length} of {products.length} products</span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table Container - Fixed in proper container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
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
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
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
                      <div className="text-sm text-gray-900 max-w-xs">
                        {product.deskripsi || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(product.harga)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.stok} items</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stok > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.stok > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stok > 10 ? 'In Stock' : product.stok > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {products.length === 0 ? 'No products found' : 'No products match your filters'}
              </h3>
              <p className="text-gray-500 mb-4">
                {products.length === 0 
                  ? 'Start by adding your first product to the catalog.' 
                  : 'Try adjusting your filter criteria.'}
              </p>
              {products.length === 0 ? (
                <Link
                  href="/admin/products/add"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add First Product
                </Link>
              ) : (
                <button
                  onClick={clearFilters}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product count info */}
        <div className="flex justify-between items-center">
          <div className="text-gray-500 text-sm">
            Showing {filteredProducts.length > 0 ? '1' : '0'}-{filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex text-black bg-bright-egg-white min-h-screen">
      <div className="px-8 pt-4 flex flex-col gap-y-6 w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-48"></div>
          <div className="h-16 bg-white rounded-lg"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsContent />
    </Suspense>
  );
}