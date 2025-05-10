'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signUpAction, type SignUpState } from './actions';
import { useEffect } from 'react';

const initialState: SignUpState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {pending ? 'Creating Account...' : 'Create Account'}
    </button>
  );
}

export default function SignUpForm() {
  const [state, formAction] = useFormState(signUpAction, initialState);

  useEffect(() => {
    if (state.success) {
      // Optionally, redirect or clear form here
      // For example, router.push('/sign-in');
      alert(state.message); // Simple alert for now
    }
  }, [state.success, state.message]);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {state.errors?.email && (
          <p className="mt-2 text-sm text-red-600">
            {state.errors.email.join(', ')}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {state.errors?.password && (
          <p className="mt-2 text-sm text-red-600">
            {state.errors.password.join(', ')}
          </p>
        )}
      </div>

      {state.message && !state.success && state.errors?.general && (
        <p className="text-sm text-red-600">{state.errors.general.join(', ')}</p>
      )}
       {state.message && state.success && (
        <p className="text-sm text-green-600">{state.message}</p>
      )}


      <SubmitButton />
    </form>
  );
} 