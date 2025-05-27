'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate required fields
    if (!formData.name.trim()) {
      setError('Product name is required');
      setLoading(false);
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError('Valid price is required');
      setLoading(false);
      return;
    }

    if (!formData.stock || Number(formData.stock) < 0) {
      setError('Valid stock quantity is required');
      setLoading(false);
      return;
    }
    
    const submitData = new FormData();
    submitData.append('name', formData.name.trim());
    submitData.append('description', formData.description.trim());
    submitData.append('price', formData.price);
    submitData.append('stock', formData.stock);
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create product');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex text-black bg-bright-egg-white min-h-screen">
      <div className="px-8 pt-4 flex flex-col gap-y-6 w-full max-w-full overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
            <p className="text-gray-600 mt-1">Create a new product in your catalog</p>
          </div>
          <Link
            href="/admin/products"
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Back to Products
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter product description (optional)"
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (IDR) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>{imagePreview ? 'Change image' : 'Upload a file'}</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Link
                href="/admin/products"
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.price || !formData.stock}
                className="flex-1 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Product...
                  </span>
                ) : (
                  'Create Product'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Tips for adding products:</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Use clear, descriptive product names</li>
            <li>Add detailed descriptions to help customers understand the product</li>
            <li>Upload high-quality images for better presentation</li>
            <li>Set competitive prices and accurate stock quantities</li>
          </ul>
        </div>
      </div>
    </div>
  );
}