import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { completeOnboarding } from '@/app/actions';
import Logo from '@/components/Logo';

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 shadow-xl rounded-2xl ring-1 ring-gray-200">
        
        <div className="flex flex-col items-center text-center">
          <Logo className="h-10 w-10 text-gray-900 mb-4" />
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome to Sign!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Let's set up your workspace. What is the name of your agency or freelance business?
          </p>
        </div>

        <form action={completeOnboarding} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700">
              Agency Name
            </label>
            <input
              id="agencyName"
              name="agencyName"
              type="text"
              required
              placeholder="e.g. Acme Media"
              className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-full bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none"
          >
            Complete Setup
          </button>
        </form>

      </div>
    </div>
  );
}
