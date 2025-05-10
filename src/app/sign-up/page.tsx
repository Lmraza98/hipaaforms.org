import SignUpForm from './SignUpForm.client';

export const metadata = {
  title: 'Sign Up - HIPAAForms.org',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Placeholder for a logo if you have one */}
        {/* <img className="mx-auto h-12 w-auto" src="/logo.svg" alt="HIPAAForms.org" /> */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignUpForm />
        </div>
         <p className="mt-4 text-center text-xs text-gray-500">
            All form data is handled in a HIPAA-compliant manner.
          </p>
      </div>
    </div>
  );
} 