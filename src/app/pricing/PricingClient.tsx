'use client';

// import { useState } from 'react';
import Link from 'next/link';

interface Plan {
  name: string;
  price: string;
  monthly: string;
  yearly: string;
  period: string;
  description: string;
  features: string[];
  link: string;
  highlight: boolean;
}

interface PricingClientProps {
  plans: Plan[];
}

export default function PricingClient({ plans }: PricingClientProps) {
  // const [billingPeriod, setBillingPeriod] = useState<'mo' | 'yr'>('mo');
  
  // const toggleBillingPeriod = () => {
  //   setBillingPeriod(billingPeriod === 'mo' ? 'yr' : 'mo');
  // };

  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container px-6 mx-auto">
        <h1 className="mb-12 text-4xl font-bold text-center text-gray-900 dark:text-white">Pricing Plans</h1>
        <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`flex flex-col p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border ${
                plan.highlight 
                  ? 'border-blue-500 dark:border-blue-400 relative' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.highlight && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
              </div>
              <ul className="flex-1 mb-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href={plan.link} 
                className={`w-full py-3 font-medium text-center rounded-lg transition ${
                  plan.highlight 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                Choose {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 