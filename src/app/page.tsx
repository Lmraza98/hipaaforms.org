'use client'
import { useState } from "react";
import Hero from "@/components/marketing/Hero.client";
import WhyChoose from "@/components/marketing/WhyChoose.client";
import dynamic from "next/dynamic";
import type { GodRaysSettings } from '@/components/marketing/GodRaysRemote.client'; // Import the interface

// This ensures the WebGL code only runs in the browser
const GodRays = dynamic(() => import('@/components/marketing/VolumetricGodRays.client'), {
  ssr: false
})

const GodRaysRemote = dynamic(() => import('@/components/marketing/GodRaysRemote.client'), {
  ssr: false,
});

const initialGodRaysSettings: GodRaysSettings = {
  exposure: 1,
  decay: .98,
  density: 1,
  weight: .59,
  samples: 160,
  invert: false,
  lightColor: '#00060F',
  lightPositionX: 20,
  lightPositionY: 7.1,
  lightPositionZ: -7.1,
  lightRadius: 0.4,
  blur: .84,
  meshPositionX: 1.7,
  meshPositionY: .4,
  meshPositionZ: -20,
  meshRadius: 0.4,
  lightShape: 'sphere',
  postProcessRatio: 0.4,
  passRatio: 0.2,
  colorIntensity: 1.5,
};

export default function Home() {
  const [godRaysSettings, setGodRaysSettings] = useState<GodRaysSettings>(initialGodRaysSettings);

  const handleSettingsChange = (newSettings: Partial<GodRaysSettings>) => {
    setGodRaysSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
  };

  return (
    <div className="flex flex-col min-h-screen justify-center">
      <GodRaysRemote settings={godRaysSettings} onSettingsChange={handleSettingsChange} />

      <div className="absolute inset-0 bg-[#000A17] z-0 w-full h-full">
        <GodRays settings={godRaysSettings} />
        <div
          className="absolute inset-0 w-full h-full z-10"
          style={{
            backgroundImage: "url('/noise.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.03,
          }}
        />
      </div>

      <div className="absolute bottom-0 self-center align-middle overflow-hidden pointer-events-none z-20 w-full h-[200vh]">
        <div className="w-full h-full scale-x-400">
          <svg
            className="w-full h-full "
            style={{
              transform: 'perspective(600px) rotateX(75deg)',
              transformOrigin: 'bottom'
            }}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="50"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0,221,255,0.1)" strokeWidth="4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      {/* Navigation removed from here */}
      
      {/* Main Content */}
      {/* flex-grow and z-30 might need adjustment depending on global layout styling */}
      <div className={`relative bg-transparent text-white`}> 
        <Hero />
        <WhyChoose />
      </div>
      {/* Footer removed from here, can be added to RootLayout if global */}
    </div>
  );
}
