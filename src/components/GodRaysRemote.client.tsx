'use client';

import React, { useState } from 'react';

export interface GodRaysSettings {
  exposure: number;
  decay: number;
  density: number;
  weight: number;
  samples: number;
  invert: boolean;
  lightColor: string; // hex string e.g., '#002E70'
  lightPositionX: number;
  lightPositionY: number;
  lightPositionZ: number;
  lightRadius: number;
  blur: number;
  enabled?: boolean;
  postProcessRatio?: number;
  passRatio?: number;
  animate?: boolean;
  colorIntensity?: number;
  lightShape?: 'sphere' | 'box' | 'plane';

  // New settings for the light-emitting mesh itself
  meshPositionX?: number;
  meshPositionY?: number;
  meshPositionZ?: number;
  meshRadius?: number;      // Radius of the actual light-emitting mesh
}

interface GodRaysRemoteProps {
  settings: GodRaysSettings;
  onSettingsChange: (newSettings: Partial<GodRaysSettings>) => void;
}

// Helper component for collapsible sections
const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; isOpenInitially?: boolean }> = ({ title, children, isOpenInitially = true }) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially);

  return (
    <div className="mb-3 border border-gray-700 rounded-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-2 bg-gray-750 hover:bg-gray-700 focus:outline-none rounded-t-md"
      >
        <h4 className="text-sm font-semibold">{title} {isOpen ? '−' : '+'}</h4>
      </button>
      {isOpen && (
        <div className="p-3 space-y-3 border-t border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

export default function GodRaysRemote({ settings, onSettingsChange }: GodRaysRemoteProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | boolean;

    if (e.target instanceof HTMLInputElement && type === 'checkbox') {
      processedValue = e.target.checked;
    } else if (type === 'range' || type === 'number') { 
      processedValue = parseFloat(value);
    } else { // This will handle text inputs and select elements
      processedValue = value;
    }

    onSettingsChange({
      [name]: processedValue,
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ lightColor: e.target.value });
  };

  return (
    <div className="bg-gray-800 bg-opacity-90 text-white p-3 rounded-lg shadow-xl fixed top-4 right-4 z-50 w-80 text-xs max-h-[95vh] overflow-y-auto">
      <h3 className="text-base font-bold mb-3 border-b border-gray-600 pb-2">God Rays Controls</h3>
      
      <CollapsibleSection title="General Settings">
        <div>
          <label htmlFor="exposure" className="block mb-1 font-medium">Exposure: {settings.exposure.toFixed(2)}</label>
          <input
            type="range"
            id="exposure"
            name="exposure"
            min="0"
            max="1"
            step="0.01"
            value={settings.exposure}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="decay" className="block mb-1 font-medium">Decay: {settings.decay.toFixed(2)}</label>
          <input
            type="range"
            id="decay"
            name="decay"
            min="0"
            max="1"
            step="0.01"
            value={settings.decay}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="density" className="block mb-1 font-medium">Density: {settings.density.toFixed(2)}</label>
          <input
            type="range"
            id="density"
            name="density"
            min="0"
            max="1"
            step="0.01"
            value={settings.density}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="weight" className="block mb-1 font-medium">Weight: {settings.weight.toFixed(2)}</label>
          <input
            type="range"
            id="weight"
            name="weight"
            min="0"
            max="1"
            step="0.01"
            value={settings.weight}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="samples" className="block mb-1 font-medium">Samples: {settings.samples}</label>
          <input
            type="range"
            id="samples"
            name="samples"
            min="10"
            max="300"
            step="10"
            value={settings.samples}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="invert"
            name="invert"
            checked={settings.invert}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
          />
          <label htmlFor="invert" className="ml-2 font-medium">Invert</label>
        </div>

        {/* Enable/Disable God Rays Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enabled"
            name="enabled"
            checked={settings.enabled ?? true}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
          />
          <label htmlFor="enabled" className="ml-2 font-medium">Enable Rays</label>
        </div>

        {/* Animate Light Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="animate"
            name="animate"
            checked={settings.animate ?? false}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
          />
          <label htmlFor="animate" className="ml-2 font-medium">Animate Light</label>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Light Source Settings" isOpenInitially={false}>
        <div>
          <label htmlFor="lightColor" className="block mb-1 font-medium">Light Color</label>
          <input
            type="color"
            id="lightColor"
            name="lightColor"
            value={settings.lightColor}
            onChange={handleColorChange}
            className="w-full h-8 p-0 border-none rounded cursor-pointer"
          />
        </div>
        {/* Color Intensity Control */}
        <div>
          <label htmlFor="colorIntensity" className="block mb-1 font-medium">Color Intensity: {settings.colorIntensity?.toFixed(2) ?? '1.0'}</label>
          <input
            type="range"
            id="colorIntensity"
            name="colorIntensity"
            min="0"
            max="5"
            step="0.1"
            value={settings.colorIntensity ?? 1}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        {/* Light Position X, Y, Z Controls */}
        <div>
          <label htmlFor="lightPositionX" className="block mb-1 font-medium">VLS Source X: {settings.lightPositionX?.toFixed(1) ?? '0.0'}</label>
          <input
            type="range"
            id="lightPositionX"
            name="lightPositionX"
            min="-20"
            max="20"
            step="0.1"
            value={settings.lightPositionX ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="lightPositionY" className="block mb-1 font-medium">VLS Source Y: {settings.lightPositionY?.toFixed(1) ?? '0.0'}</label>
          <input
            type="range"
            id="lightPositionY"
            name="lightPositionY"
            min="-20"
            max="20"
            step="0.1"
            value={settings.lightPositionY ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="lightPositionZ" className="block mb-1 font-medium">VLS Source Z: {settings.lightPositionZ?.toFixed(1) ?? '0.0'}</label>
          <input
            type="range"
            id="lightPositionZ"
            name="lightPositionZ"
            min="-50"
            max="50"
            step="0.1"
            value={settings.lightPositionZ ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Light Emitter Mesh Settings" isOpenInitially={false}>
        {/* Light Shape Select */}
        <div>
          <label htmlFor="lightShape" className="block mb-1 font-medium">Emitter Shape</label>
          <select
            id="lightShape"
            name="lightShape"
            value={settings.lightShape ?? 'sphere'}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="sphere">Sphere</option>
            <option value="box">Box</option>
            <option value="plane">Plane</option>
          </select>
        </div>
        {/* Mesh Radius Control */}
        <div>
          <label htmlFor="meshRadius" className="block mb-1 font-medium">Emitter Mesh Radius: {settings.meshRadius?.toFixed(2) ?? '0.50'}</label>
          <input
            type="range"
            id="meshRadius"
            name="meshRadius"
            min="0.05"
            max="5"
            step="0.05"
            value={settings.meshRadius ?? 0.5}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        {/* Mesh Position X, Y, Z Controls */}
        <div>
          <label htmlFor="meshPositionX" className="block mb-1 font-medium">Emitter Mesh X: {settings.meshPositionX?.toFixed(1) ?? '0.0'}</label>
          <input
            type="range"
            id="meshPositionX"
            name="meshPositionX"
            min="-20"
            max="20"
            step="0.1"
            value={settings.meshPositionX ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="meshPositionY" className="block mb-1 font-medium">Emitter Mesh Y: {settings.meshPositionY?.toFixed(1) ?? '0.0'}</label>
          <input
            type="range"
            id="meshPositionY"
            name="meshPositionY"
            min="-20"
            max="20"
            step="0.1"
            value={settings.meshPositionY ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="meshPositionZ" className="block mb-1 font-medium">Emitter Mesh Z: {settings.meshPositionZ?.toFixed(1) ?? '0.0'}</label>
          <input
            type="range"
            id="meshPositionZ"
            name="meshPositionZ"
            min="-20"
            max="20"
            step="0.1"
            value={settings.meshPositionZ ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title="Post-Processing & Effect Tuning" isOpenInitially={false}>
        {/* Post Process Ratio Control */}
        <div>
          <label htmlFor="postProcessRatio" className="block mb-1 font-medium">Post Process Ratio: {settings.postProcessRatio?.toFixed(2) ?? '0.2'}</label>
          <input
            type="range"
            id="postProcessRatio"
            name="postProcessRatio"
            min="0.1"
            max="1"
            step="0.1"
            value={settings.postProcessRatio ?? 0.2}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Pass Ratio Control */}
        <div>
          <label htmlFor="passRatio" className="block mb-1 font-medium">Pass Ratio: {settings.passRatio?.toFixed(2) ?? '0.4'}</label>
          <input
            type="range"
            id="passRatio"
            name="passRatio"
            min="0.1"
            max="1"
            step="0.1"
            value={settings.passRatio ?? 0.4}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        {/* Light Radius Control (related to VLS effect) */}
        <div>
          <label htmlFor="lightRadius" className="block mb-1 font-medium">VLS Effect Radius: {settings.lightRadius?.toFixed(2) ?? '0.00'}</label>
          <input
            type="range"
            id="lightRadius"
            name="lightRadius"
            min="0.05" // Smallest practical radius based on sphere size
            max="10"   // Increased max for more range
            step="0.05"
            value={settings.lightRadius ?? 0.5}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Blur Control */}
        <div>
          <label htmlFor="blur" className="block mb-1 font-medium">Blur: {settings.blur?.toFixed(2) ?? '0.00'}</label>
          <input
            type="range"
            id="blur"
            name="blur"
            min="0"
            max="0.99" // Max blur almost 1 (as 1 might make density 0)
            step="0.01"
            value={settings.blur ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </CollapsibleSection>

    </div>
  );
} 