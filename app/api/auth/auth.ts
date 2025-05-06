"use server"

import bcrypt from "bcrypt";
import { LoginFormSchema, SignupFormSchema } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/session";

export async function signup(formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
        verificationToken: crypto.randomUUID(), // Generate a unique token for email verification
      },
    });

    await createSession(user.id, user.role);
    redirect('/');
  } catch (error) {
    return { errors: { email: ["Email is already in use."] } };
  }
}

export async function login(formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { errors: { email: ["Invalid email or password."] } };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { errors: { password: ["Invalid email or password."] } };
    }

    const token = await createSession(user.id, user.role);

    return { token }

    
  } catch (error) {
    console.error("Login error:", error);
    return { errors: { general: ["An error occurred. Please try again."] } };
  }
}

export async function logout() {
  deleteSession()
  redirect('/login')
}