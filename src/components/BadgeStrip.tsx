'use client'

import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';

interface BadgeData {
  name: string;
  tooltip: string;
}

export default function BadgeStrip() {
  // Badges with their tooltip information
  const badges: BadgeData[] = [
    { name: 'HIPAA', tooltip: 'All data is encrypted in transit and at rest per HIPAA requirements' },
    { name: 'SOC 2', tooltip: 'SOC 2 Type II certified for secure data handling and privacy controls' },
    { name: 'AWS GovCloud', tooltip: 'Hosted on AWS GovCloud for maximum compliance and security' }
  ];
  
  // Tippy needs client-side rendering
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) {
    // Simple SSR-compatible version
    return (
      <div className="flex flex-wrap gap-3 mt-6 items-center">
        {badges.map((badge) => (
          <div key={badge.name} className="px-3 py-1.5 bg-gray-800/60 backdrop-blur rounded-full border border-white/10">
            <span className="text-xs md:text-sm font-medium text-gray-200">{badge.name}</span>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-3 mt-6 items-center">
      {badges.map((badge) => (
        <Tippy 
          key={badge.name}
          content={badge.tooltip}
          animation="shift-away"
          arrow={false}
          placement="bottom"
          theme="dark"
        >
          <div className="px-3 py-1.5 bg-gray-800/60 backdrop-blur rounded-full border border-white/10 cursor-help transition-all duration-200 hover:bg-gray-700/60">
            <span className="text-xs md:text-sm font-medium text-gray-200">{badge.name}</span>
          </div>
        </Tippy>
      ))}
    </div>
  );
} 