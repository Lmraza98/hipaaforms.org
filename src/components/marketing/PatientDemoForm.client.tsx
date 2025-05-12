'use client'

import React from 'react';

export default function PatientDemoForm() {
  return (
    <form className="w-full max-w-md rounded-2xl p-8 md:p-10 bg-transparent backdrop-blur-md border border-gray-800/60 shadow-xl shadow-black/50 mx-auto transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/30">
      {/* Grid Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* First Name */}
        <div>
          <label className="block text-xs text-white mb-1" htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            placeholder="Jane"
            className="w-full rounded-md bg-gray-800/70 border border-gray-700/60 py-2 px-3 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        
        {/* Last Name */}
        <div>
          <label className="block text-xs text-white mb-1" htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            placeholder="Doe"
            className="w-full rounded-md bg-gray-800/70 border border-gray-700/60 py-2 px-3 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        
        {/* DOB */}
        <div>
          <label className="block text-xs text-white mb-1" htmlFor="dob">Date of Birth</label>
          <input
            id="dob"
            type="date"
            className="w-full rounded-md bg-gray-800/70 border border-gray-700/60 py-2 px-3 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        
        {/* Phone */}
        <div>
          <label className="block text-xs text-white mb-1" htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            className="w-full rounded-md bg-gray-800/70 border border-gray-700/60 py-2 px-3 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        
        {/* Email (full width) */}
        <div className="md:col-span-2">
          <label className="block text-xs text-white mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="jane.doe@example.com"
            className="w-full rounded-md bg-gray-800/70 border border-gray-700/60 py-2 px-3 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        
        {/* Insurance Provider */}
        <div>
          <label className="block text-xs text-white mb-1" htmlFor="insurance">Insurance Provider</label>
          <input
            id="insurance"
            type="text"
            placeholder="Provider Name"
            className="w-full rounded-md bg-gray-800/70 border border-gray-700/60 py-2 px-3 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        
        {/* Policy Number */}
        <div>
          <label className="block text-xs text-white mb-1" htmlFor="policyNumber">Policy #</label>
          <input
            id="policyNumber"
            type="text"
            placeholder="123456789"
            className="w-full rounded-md bg-gray-800/70 border border-gray-700/60 py-2 px-3 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
      
      {/* Medical History Textarea */}
      <div className="mt-4">
        <label className="block text-xs text-white mb-1" htmlFor="medicalHistory">Medical History Notes</label>
        <textarea
          id="medicalHistory"
          rows={4}
          placeholder="Briefly describe any significant medical history..."
          className="w-full rounded-md bg-gray-800/70 border border-gray-700/60 py-2 px-3 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-24"
        ></textarea>
      </div>
      
      {/* HIPAA Footnote */}
      <p className="mt-4 text-[11px] text-gray-500">All data entered here is encrypted in transit and stored securely in compliance with HIPAA.</p>
      
      {/* Submit Button */}
      <button
        type="button"
        className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 rounded-md focus:ring-2 focus:ring-blue-500 shadow-md transition-all duration-300"
      >
        Submit Form
      </button>
    </form>
  );
} 