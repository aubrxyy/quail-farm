'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  slug: string;
  harga: number;
  stock: number;
  deskripsi: string;
  gambar: string;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProduct();
  }, []);

  async function fetchProduct() {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PATCH',
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
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link 
          href="/admin/products" 
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
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
            required
            defaultValue={product?.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={product?.slug}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              required
              min="0"
              step="0.01"
              defaultValue={product?.harga}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              required
              min="0"
              defaultValue={product?.stock}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            required
            rows={4}
            defaultValue={product?.deskripsi}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Image
          </label>
          {product?.gambar && (
            <div className="mb-3">
              <img 
                src={product.gambar} 
                alt={product.name} 
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
          
          <label htmlFor="gambar" className="block text-sm font-medium text-gray-700 mb-1">
            Upload New Image (optional)
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
            Leave empty to keep current image. Accepted formats: JPG, PNG, GIF. Max size: 5MB
          </p>
          
          {imagePreview && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">New Image Preview:</p>
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
            disabled={saving}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Update Product'}
          </button>
          
          <Link
            href="/admin/products"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}