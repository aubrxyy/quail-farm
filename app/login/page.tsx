'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [errors, setErrors] = useState<{ email?: string[]; password?: string[]; general?: string[] } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors);
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: ['An unexpected error occurred. Please try again.'] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#E6DCB8] text-black h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Email" required />
          {errors?.email && <p className="text-red-500">{errors.email.join(', ')}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
          {errors?.password && <p className="text-red-500">{errors.password.join(', ')}</p>}
        </div>

        {errors?.general && <p className="text-red-500">{errors.general.join(', ')}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}