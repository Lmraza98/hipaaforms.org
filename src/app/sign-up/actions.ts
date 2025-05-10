'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const SignUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
});

export type SignUpState = {
  message: string;
  success: boolean;
  errors?: {
    email?: string[];
    password?: string[];
    general?: string[];
  };
};

export async function signUpAction(
  prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = SignUpSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        message: 'An account with this email already exists.',
        success: false,
        errors: {
          general: ['An account with this email already exists.'],
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // In a real app, you might want to send a verification email here
    // or automatically sign the user in.

    return {
      message: 'Account created successfully! You can now sign in.',
      success: true,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      success: false,
      errors: {
        general: ['An unexpected error occurred. Please try again.'],
      },
    };
  }
} 