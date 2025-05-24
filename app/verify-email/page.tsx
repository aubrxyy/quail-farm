"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Verifying...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus("Invalid verification link.");
        setSuccess(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const text = await response.text();
        const result = JSON.parse(text);
        if (response.ok) {
          setStatus("Email verified successfully! You can now log in.");
          setSuccess(true);
        } else {
          setStatus(result.error || "Verification failed.");
          setSuccess(false);
        }
      } catch (error) {
        setStatus("An unexpected error occurred.");
        setSuccess(false);
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#F6F3E7] ${poppins.className}`}>
      <div className="bg-white rounded-3xl shadow-lg px-10 py-12 flex flex-col items-center max-w-md w-full">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-2">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#EDC043" />
              <path
                d="M16 24l6 6 10-10"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-[#EDC043] mb-2" style={{ fontFamily: 'Milker, sans-serif' }}>
            Email Verification
          </h1>
        </div>
        <p className={`mb-6 text-lg ${success ? "text-[#2dbd7f]" : "text-[#f25c5c]"}`}>
          {status}
        </p>
        {success && (
          <Link
            href="/login"
            className="inline-block bg-[#EDC043] text-white font-bold px-8 py-3 rounded-xl shadow hover:bg-[#f6a700] transition mb-3"
          >
            Go to Login
          </Link>
        )}
        <Link
          href="/"
          className="inline-block text-[#EDC043] font-bold px-8 py-2 rounded-xl hover:underline transition"
        >
          Go to Home Page
        </Link>
      </div>
    </div>
  );
}