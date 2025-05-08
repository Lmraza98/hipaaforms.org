import PricingClient from './PricingClient';

export const metadata = {
  title: 'Pricing - HIPAAForms.org',
  description: 'Choose the right plan for your healthcare forms needs',
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      monthly: '0',
      yearly: '0',
      period: 'mo',
      description: 'Get started with essential HIPAA-compliant forms',
      features: [
        'Up to 3 form templates',
        'Secure form submissions',
        'Basic analytics',
        'Standard support',
      ],
      link: '/checkout?plan=free',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$19',
      monthly: '19',
      yearly: '190',
      period: 'mo',
      description: 'Perfect for individual practitioners',
      features: [
        'Unlimited templates',
        'Priority email support',
        'Advanced analytics',
        'Custom branding',
        'Priority processing',
      ],
      link: '/checkout?plan=pro',
      highlight: true,
    },
    {
      name: 'Clinic',
      price: '$79',
      monthly: '79',
      yearly: '790',
      period: 'mo',
      description: 'Designed for healthcare clinics and groups',
      features: [
        'Unlimited templates',
        'Multi-user access',
        'BAA on request',
        'Team management',
        'Dedicated support',
        'Advanced workflows',
      ],
      link: '/checkout?plan=clinic',
      highlight: false,
    },
  ];

  return <PricingClient plans={plans} />;
}
