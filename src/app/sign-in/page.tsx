import SignInForm from './SignInForm.client';

export const metadata = {
  title: 'Sign In - HIPAAForms.org',
};

export default function SignInPage() {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
      <SignInForm />
    </div>
  );
} 