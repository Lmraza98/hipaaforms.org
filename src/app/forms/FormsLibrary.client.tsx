'use client';

import { useState, useMemo } from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';
import type { FormMeta } from '@/types/forms';

// Move mockForms to API route - keeping this here but commented out
/*
const mockForms: FormMeta[] = [
  { slug: 'patient-intake', name: 'Patient Intake', type: 'Intake', specialty: 'General', price: 'free' },
  { slug: 'telehealth-consent', name: 'Telehealth Consent', type: 'Consent', specialty: 'Telehealth', price: 'pro' },
  { slug: 'hipaa-release', name: 'HIPAA Release', type: 'Release', specialty: 'Legal', price: 'clinic' },
  { slug: 'mental-health-screening', name: 'Mental Health Screening', type: 'Assessment', specialty: 'Psychiatry', price: 'pro' },
  { slug: 'diabetes-care-plan', name: 'Diabetes Care Plan', type: 'Care Plan', specialty: 'Endocrinology', price: 'clinic' },
  { slug: 'pediatric-growth-chart', name: 'Pediatric Growth Chart', type: 'Chart', specialty: 'Pediatrics', price: 'free' },
  { slug: 'physical-therapy-consent', name: 'PT Consent Form', type: 'Consent', specialty: 'Physical Therapy', price: 'pro' },
  { slug: 'covid-screening', name: 'COVID-19 Screening', type: 'Screening', specialty: 'General', price: 'free' },
  { slug: 'medical-records-release', name: 'Medical Records Release', type: 'Release', specialty: 'Legal', price: 'free' }
];
*/

interface FormsLibraryProps {
  initialForms: FormMeta[];
}

export default function FormsLibrary({ initialForms }: FormsLibraryProps) {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [sortBy, setSortBy] = useState('a-z');
  
  // Use initialForms from props now that we're fetching from API
  const forms = initialForms;
  
  // Get unique specialties for the dropdown
  const specialties = [...new Set(forms.map(form => form.specialty))].sort();
  
  // Filter and sort forms based on search, specialty, and sort option
  const filteredForms = useMemo(() => {
    const filtered = forms.filter(form => 
      form.name.toLowerCase().includes(search.toLowerCase()) && 
      (specialty === '' || form.specialty === specialty)
    );
    
    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch(sortBy) {
        case 'a-z':
          return a.name.localeCompare(b.name);
        case 'z-a':
          return b.name.localeCompare(a.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'price':
          // Free forms first, then pro, then clinic
          const priceOrder = { free: 0, pro: 1, clinic: 2 };
          return priceOrder[a.price as keyof typeof priceOrder] - priceOrder[b.price as keyof typeof priceOrder];
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [forms, search, specialty, sortBy]);

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Form Library</h1>
      
      {/* Filter Bar */}
      <div className="sticky top-24 z-10 bg-gray-950/90 backdrop-blur rounded-md py-3 border-b border-gray-800/70 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search forms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:max-w-sm rounded-lg bg-gray-800/70 border border-gray-700/60 py-2 px-3 text-sm text-gray-100 shadow-inner shadow-black/40 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
              className="w-full sm:w-44 rounded-md bg-gray-800/70 border border-gray-700/60 py-2 px-3 text-sm text-gray-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Specialties</option>
              {specialties.map(spec => (
                <option key={spec}>{spec}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full sm:w-36 rounded-md bg-gray-800/70 border border-gray-700/60 py-2 px-3 text-sm text-gray-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="a-z">Sort: A-Z</option>
              <option value="z-a">Sort: Z-A</option>
              <option value="type">Sort: Type</option>
              <option value="price">Sort: Price</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Form Grid */}
      {filteredForms.length > 0 ? (
        <div className="grid gap-6 auto-cols-fr" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))' }}>
          {filteredForms.map(form => (
            <div 
              key={form.slug}
              className="group max-w-80 w-full rounded-xl bg-gray-800/60 border border-gray-700 p-5 flex flex-col relative transition hover:shadow-lg hover:-translate-y-0.5 hover:ring-1 hover:ring-blue-400/40"
            >
              <DocumentIcon className="w-5 h-5 text-blue-500" />
              <h3 className="mt-3 font-semibold text-gray-100">{form.name}</h3>
              <p className="text-xs text-gray-400/80 mt-1">{form.type} · {form.specialty}</p>
              
              {form.price !== 'free' && (
                <span className="absolute top-4 right-4 text-xs font-semibold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-md opacity-90 group-hover:opacity-100 transition-opacity">
                  {form.price.charAt(0).toUpperCase() + form.price.slice(1)}
                </span>
              )}
              
              <div className="mt-auto pt-4">
                {form.price === 'free' ? (
                  <a 
                    href={`/forms/${form.slug}`} 
                    className="btn-secondary bg-transparent hover:bg-blue-500 hover:text-white text-blue-300 w-full mt-6 transition-colors"
                    aria-label={`Download ${form.name} form`}
                  >
                    Download
                  </a>
                ) : (
                  <a 
                    href="/pricing" 
                    className="btn-secondary bg-transparent hover:bg-gray-800/40 text-blue-300 w-full mt-6 transition-colors"
                    aria-label={`Preview ${form.name} form (Pro required)`}
                  >
                    Preview
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 max-w-md mx-auto">
          <div className="rounded-lg bg-gray-800/30 p-8 border border-gray-700/50">
            <DocumentIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No forms found</h3>
            <p className="text-gray-400">Try a different search term or clear your filters.</p>
            <button 
              onClick={() => { setSearch(''); setSpecialty(''); }}
              className="mt-6 text-blue-400 hover:text-blue-300 font-medium"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 