'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Poppins } from 'next/font/google';

const pop = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function LoginPage() {
  const [errors, setErrors] = useState<{ email?: string[]; password?: string[]; general?: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

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
    <div className={`${pop.className} bg-cover bg-center h-screen`} style={{ backgroundImage: "url('/loginBG.jpeg')" }}>
      <div className="flex items-center justify-center h-full px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-black mb-12 text-center">Masuk</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name='email'
                type="email"
                id="email"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#A0522D] text-black"
                placeholder="Masukkan email"
                required
              />
              {errors?.email && <p className="text-red-500">{errors.email.join(', ')}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name='password'
                type="password"
                id="password"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#A0522D] text-black"
                placeholder="Masukkan password"
                required
              />
              {errors?.password && <p className="text-red-500">{errors.password.join(', ')}</p>}
            </div>
            {errors?.general && <p className="text-red-500">{errors.general.join(', ')}</p>}
            <p className="mt-4 mb-4 text-left text-sm text-gray-400">
              Belum punya akun?{' '}
              <a href="/register" className="text-[#EDB943] hover:underline">
                Daftar di sini
              </a>
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#EDB943] text-white font-bold py-2 rounded-md hover:bg-[#8B4513] transition duration-200"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
            <hr className="mt-2" />
            <div className="flex justify-center">
              <Image src="/logo.png" width={150} height={100} alt="Cimahpar Quail Farm" className="mt-20" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


// div className="bg-[#E6DCB8] text-black h-screen flex flex-col items-center justify-center">
//       <h1 className="text-2xl font-bold">Login</h1>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <div>
//           <label htmlFor="email">Email</label>
//           <input id="email" name="email" type="email" placeholder="Email" required />
//           {errors?.email && <p className="text-red-500">{errors.email.join(', ')}</p>}
//         </div>

//         <div>
//           <label htmlFor="password">Password</label>
//           <input id="password" name="password" type="password" required />
//           {errors?.password && <p className="text-red-500">{errors.password.join(', ')}</p>}
//         </div>

//         {errors?.general && <p className="text-red-500">{errors.general.join(', ')}</p>}

//         <button
//           type="submit"
//           className="bg-blue-500 text-white p-2 rounded"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>