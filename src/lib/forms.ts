import type { FormMeta } from '@/types/forms';

export const mockForms: FormMeta[] = [
    { slug: 'patient-intake', name: 'Patient Intake', type: 'Intake', specialty: 'General', price: 'free' },
    { slug: 'telehealth-consent', name: 'Telehealth Consent', type: 'Consent', specialty: 'Telehealth', price: 'pro' },
    { slug: 'hipaa-release', name: 'HIPAA Release', type: 'Release', specialty: 'Legal', price: 'clinic' },
    { slug: 'mental-health-screening', name: 'Mental Health Screening', type: 'Assessment', specialty: 'Psychiatry', price: 'pro' },
    { slug: 'diabetes-care-plan', name: 'Diabetes Care Plan', type: 'Care Plan', specialty: 'Endocrinology', price: 'clinic' },
    { slug: 'pediatric-growth-chart', name: 'Pediatric Growth Chart', type: 'Chart', specialty: 'Pediatrics', price: 'free' },
    { slug: 'covid-screening', name: 'COVID-19 Screening', type: 'Screening', specialty: 'General', price: 'free' },
  ];