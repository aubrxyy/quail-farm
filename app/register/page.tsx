'use client'

import { signup } from '@/app/api/auth/auth'
import { useState } from 'react'

export default function Register() {
  const [errors, setErrors] = useState<any>(null)
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    setErrors(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)
    if (result.errors) {
      setErrors(result.errors)
    } else {
      setSuccess(true)
    }

    setPending(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#E6DCB8] text-black h-screen flex flex-col items-center justify-center"
    >
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      {errors?.name && <p>{errors.name}</p>}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" />
      </div>
      {errors?.email && <p>{errors.email}</p>}

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      {errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {errors.password.map((error: string) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}

      {success && <p className="text-green-500">Signup successful!</p>}

      <button disabled={pending} type="submit">
        {pending ? 'Submitting...' : 'Sign Up'}
      </button>
    </form>
  )
}