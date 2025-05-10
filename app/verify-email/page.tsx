"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus("Invalid verification link.");
        return;
      }

      try {
  const response = await fetch(`/api/auth/verify-email?token=${token}`);
  const text = await response.text(); // Read the response as plain text
  console.log("Response text:", text);

  const result = JSON.parse(text); // Parse the text as JSON
  if (response.ok) {
    setStatus("Email verified successfully! You can now log in.");
  } else {
    setStatus(result.error || "Verification failed.");
  }
} catch (error) {
  console.error("Verification error:", error);
  setStatus("An unexpected error occurred.");
}
    }

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}