'use client'

import { useEffect, useState, useMemo } from 'react';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarDaysIcon,
  IdentificationIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

interface FormField {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  required?: boolean;
  colSpan?: number;
  component?: 'input' | 'textarea';
  rows?: number;
  showOnMobile?: boolean;
}

export default function FormCard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fields = useMemo<FormField[]>(() => [
    { 
      id: 'firstName', 
      name: 'First Name', 
      type: 'text', 
      placeholder: 'Jane', 
      icon: <UserIcon className="w-5 h-5 text-gray-400" />, 
      required: true,
      showOnMobile: true
    },
    { 
      id: 'lastName', 
      name: 'Name', 
      type: 'text', 
      placeholder: 'Doe', 
      icon: <UserIcon className="w-5 h-5 text-gray-400" />, 
      required: true,
      showOnMobile: true
    },
    { 
      id: 'dob', 
      name: 'Date of birth', 
      type: 'date', 
      placeholder: 'mm/dd/yyyy', 
      icon: <CalendarDaysIcon className="w-5 h-5 text-gray-400" />, 
      required: true,
      showOnMobile: false
    },
    { 
      id: 'phone', 
      name: 'Phone', 
      type: 'tel', 
      placeholder: '123 456 7576', 
      icon: <PhoneIcon className="w-5 h-5 text-gray-400" />, 
      required: true,
      showOnMobile: true
    },
    { 
      id: 'email', 
      name: 'Email', 
      type: 'email', 
      placeholder: 'jane.doe@example.com', 
      icon: <EnvelopeIcon className="w-5 h-5 text-gray-400" />, 
      required: true,
      colSpan: 2,
      showOnMobile: true
    },
    { 
      id: 'insurance', 
      name: 'Insurance Provider', 
      type: 'text', 
      placeholder: 'Provider Name', 
      icon: <IdentificationIcon className="w-5 h-5 text-gray-400" />, 
      required: true,
      showOnMobile: false
    },
    { 
      id: 'policyNumber', 
      name: 'Policy Number', 
      type: 'text', 
      placeholder: '123456789', 
      icon: <IdentificationIcon className="w-5 h-5 text-gray-400" />, 
      required: true,
      showOnMobile: false
    },
    { 
      id: 'medicalNotes', 
      name: 'Medical History Notes', 
      type: 'text', 
      placeholder: 'Briefly describe any significant medical history..', 
      icon: <DocumentTextIcon className="w-5 h-5 text-gray-400" />, 
      component: 'textarea',
      rows: 4,
      colSpan: 2,
      showOnMobile: false
    },
  ], []);

  // Get visible fields based on screen size
  const visibleFields = fields.filter(field => !isMobile || field.showOnMobile);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      dob: '',
      phone: '',
      email: '',
      insurance: '',
      policyNumber: '',
      medicalNotes: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  // Calculate completion percentage
  const [completion, setCompletion] = useState(0);
  
  useEffect(() => {
    const requiredFields = fields.filter(field => field.required);
    const filledFields = requiredFields.filter(field => 
      formik.values[field.id as keyof typeof formik.values]?.trim() !== ''
    );
    
    setCompletion((filledFields.length / requiredFields.length) * 100);
  }, [formik, fields]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-md bg-transparent border border-white/10 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl transition-all duration-300 hover:shadow-[0_20px_60px_-10px_rgba(25,246,232,0.05)]"
    >
      <form onSubmit={formik.handleSubmit}>
        {/* Progress bar */}
        <div className="mb-4 sm:mb-6 relative h-1 w-full bg-gray-700/60 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 bottom-0 bg-[#19F6E8]"
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.5 }}
          />
          <span className="absolute -right-1 -bottom-5 sm:-bottom-6 text-xs text-gray-400">
            {Math.round(completion)}%
          </span>
        </div>
        
        {/* Form fields grid */}
        <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
          {visibleFields.map((field) => (
            <div 
              key={field.id} 
              className={`relative ${field.colSpan === 2 ? 'col-span-1 sm:col-span-2' : ''}`}
            >
              <label className="block text-xs text-gray-400 mb-0.5 sm:mb-1" htmlFor={field.id}>
                {field.name}
              </label>
              <div className="relative">
                <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {field.icon}
                </div>
                
                {field.component === 'textarea' ? (
                  <textarea
                    id={field.id}
                    name={field.id}
                    rows={field.rows}
                    placeholder={field.placeholder}
                    onChange={formik.handleChange}
                    value={formik.values[field.id as keyof typeof formik.values]}
                    className="h-16 sm:h-18 w-full rounded-lg sm:rounded-xl bg-gray-800/50 border border-white/10 py-1.5 sm:py-2 pl-8 sm:pl-10 pr-2 sm:pr-3 text-xs sm:text-sm text-gray-100 focus:ring-2 focus:ring-[#19F6E8] focus:border-transparent focus:outline-none resize-none"
                  />
                ) : (
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    onChange={formik.handleChange}
                    value={formik.values[field.id as keyof typeof formik.values]}
                    className="w-full rounded-lg sm:rounded-xl bg-gray-800/50 border border-white/10 py-1.5 sm:py-2 pl-8 sm:pl-10 pr-2 sm:pr-3 text-xs sm:text-sm text-gray-100 focus:ring-2 focus:ring-[#19F6E8] focus:border-transparent focus:outline-none caret-[#19F6E8]"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* View full form link on mobile */}
        {isMobile && (
          <button
            type="button"
            onClick={() => setIsMobile(false)}
            className="mt-3 text-[11px] text-blue-400 hover:text-blue-300 underline"
          >
            Show all fields
          </button>
        )}
        
        {/* Privacy notice */}
        <p className="mt-3 sm:mt-4 text-[10px] sm:text-[11px] text-gray-500">
          All data entered here is encrypted in transit and stored securely in compliance with HIPAA.
        </p>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 sm:mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 sm:py-2 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#19F6E8] focus:outline-none transition-all duration-300"
        >
          Submit Form
        </button>
      </form>
    </motion.div>
  );
} 