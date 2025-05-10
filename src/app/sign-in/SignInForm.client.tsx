'use client';

import { useState, useTransition } from 'react';
import { signInAction } from './actions';
import { signIn } from 'next-auth/react'; // For client-side NextAuth.js v4 sign-in
import { useRouter } from 'next/navigation'; // For client-side redirection

interface ClientFormErrors {
  email?: string[];
  password?: string[];
  _form?: string[]; // For general form errors if any from Zod
}

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<ClientFormErrors>({});
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors({});
    setSignInError(null);

    startTransition(async () => {
      // 1. Call server action for validation
      const validationResult = await signInAction({ email, password });

      if (!validationResult.success) {
        // Extract field-specific errors from Zod's formatted errors
        const newFormErrors: ClientFormErrors = {};
        if (validationResult.errors?.email?._errors) {
          newFormErrors.email = validationResult.errors.email._errors;
        }
        if (validationResult.errors?.password?._errors) {
          newFormErrors.password = validationResult.errors.password._errors;
        }
        if (validationResult.errors?._errors && validationResult.errors._errors.length > 0) {
            // Handle form-level errors if Zod schema provides them directly
            newFormErrors._form = validationResult.errors._errors;
        }
        setFormErrors(newFormErrors);
        return;
      }

      // 2. If validation successful, attempt client-side sign-in with NextAuth.js
      const result = await signIn('credentials', {
        redirect: false, // We want to handle the redirect or error manually
        email: email,
        password: password,
      });

      if (result?.error) {
        // Handle errors from NextAuth.js (e.g., invalid credentials)
        let errorMessage = 'Sign in failed. Please check your credentials.';
        if (result.error === 'CredentialsSignin') {
          errorMessage = 'Invalid email or password.';
        }
        // You can add more specific error messages based on result.error if needed
        setSignInError(errorMessage);
      } else if (result?.ok) {
        // Successful sign-in, redirect to dashboard
        router.push('/dashboard');
      } else {
        // Fallback for other unexpected issues from signIn
        setSignInError('An unexpected error occurred during sign in.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formErrors.email && (
          <p className="mt-1 text-xs text-red-600">{formErrors.email.join(', ')}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formErrors.password && (
          <p className="mt-1 text-xs text-red-600">{formErrors.password.join(', ')}</p>
        )}
      </div>

      {/* Display form-level Zod errors if they exist */} 
      {formErrors._form && formErrors._form.length > 0 && (
        <div className="text-sm text-red-600">
          {formErrors._form.map((err, index) => (
            <p key={index}>{err}</p>
          ))}
        </div>
      )}

      {signInError && (
        <p className="text-sm text-red-600">{signInError}</p>
      )}

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </form>
  );
} 