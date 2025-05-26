'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  slug?: string;
  gambar: string;
  harga: number;
  deskripsi: string;
  stok: number;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (resolvedParams.id) {
      fetchProduct();
    }
  }, [resolvedParams.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${resolvedParams.id}`);
      if (response.ok) {
        const productData = await response.json();
        setProduct(productData);
        if (productData.gambar) {
          setImagePreview(productData.gambar);
        }
      } else {
        setError('Product not found');
        setTimeout(() => router.push('/admin/products'), 2000);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product data');
    } finally {
      setFetchLoading(false);
    }
  };

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(product?.gambar || null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    // Add current image as fallback
    if (!formData.get('gambar') || (formData.get('gambar') as File).size === 0) {
      formData.set('currentImage', product?.gambar || '');
    }

    try {
      const response = await fetch(`/api/products/${resolvedParams.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
          <div className="h-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link href="/admin/products" className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Product #{product.id}</h1>
        <Link 
          href="/admin/products" 
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          Back to Products
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={product.name}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug (optional)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={product.slug || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="product-slug (auto-generated if empty)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-1">
              Price (Rp) *
            </label>
            <input
              type="number"
              id="harga"
              name="harga"
              defaultValue={product.harga}
              required
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="15000"
            />
          </div>

          <div>
            <label htmlFor="stok" className="block text-sm font-medium text-gray-700 mb-1">
              stok *
            </label>
            <input
              type="number"
              id="stok"
              name="stok"
              defaultValue={product.stok}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100"
            />
          </div>
        </div>

        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            defaultValue={product.deskripsi}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Product description..."
          />
        </div>

        <div>
          <label htmlFor="gambar" className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </label>
          <input
            type="file"
            id="gambar"
            name="gambar"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Accepted formats: JPG, PNG, GIF. Max size: 5MB. Leave empty to keep current image.
          </p>
          
          {imagePreview && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Image Preview:
              </p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
          
          <Link
            href="/admin/products"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Product Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Product Information:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Product ID: <strong>#{product.id}</strong></li>
          <li>• Created: {new Date(product.createdAt).toLocaleDateString('id-ID')}</li>
          <li>• Last Updated: {new Date(product.updatedAt).toLocaleDateString('id-ID')}</li>
        </ul>
      </div>
    </div>
  );
}