'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

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

  // --- BEGINNING OF NEWLY ADDED FIELDS ---
  preset?: 'none' | 'soft' | 'cone';
  devWireframe?: boolean;
  devBoundingBoxes?: boolean;
  devGizmos?: boolean;
  devLogFps?: boolean;
  panelX?: number;   // persisted
  panelY?: number;   // persisted
  panelHidden?: boolean; // persisted
  // --- END OF NEWLY ADDED FIELDS ---
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

const PRESETS: Record<string, Partial<GodRaysSettings>> = {
  none: {},
  soft: {
    preset: 'soft',
    exposure: 0.15,
    decay: 0.95,
    density: 0.5,
    weight: 0.4,
    samples: 60,
    blur: 0.1,
    meshRadius: 1.0,
    lightRadius: 1.0,
    colorIntensity: 1.5,
  },
  cone: {
    preset: 'cone',
    exposure: 0.3,
    decay: 0.98,
    density: 0.9,
    weight: 0.8,
    samples: 120,
    blur: 0.01,
    meshRadius: 0.2,
    lightRadius: 0.1,
    lightPositionZ: -5,
    colorIntensity: 2.5,
  },
};

export default function GodRaysRemote({ settings: propsSettings, onSettingsChange }: GodRaysRemoteProps) {
  const [internalSettings, setInternalSettings] = useState<GodRaysSettings>(propsSettings);
  
  const [panelPosition, setPanelPosition] = useState({ x: 20, y: 20 });
  const [isPanelHidden, setIsPanelHidden] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const [isMobileView, setIsMobileView] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isDevMode, setIsDevMode] = useState(process.env.NODE_ENV !== 'production');

  const onSettingsChangeRef = useRef(onSettingsChange);
  useEffect(() => {
    onSettingsChangeRef.current = onSettingsChange;
  }, [onSettingsChange]);

  // Initial setup: Load from localStorage, set initial panel/dev/mobile states, and comprehensive internalSettings
  useEffect(() => {
    const storedX = localStorage.getItem('godRaysPanelX');
    const storedY = localStorage.getItem('godRaysPanelY');
    const storedHidden = localStorage.getItem('godRaysPanelHidden');

    const initialPanelX = storedX ? parseInt(storedX, 10) : (propsSettings.panelX ?? 20);
    const initialPanelY = storedY ? parseInt(storedY, 10) : (propsSettings.panelY ?? 20);
    const initialPanelHidden = storedHidden ? (storedHidden === 'true') : (propsSettings.panelHidden ?? false);

    setPanelPosition({ x: initialPanelX, y: initialPanelY });
    setIsPanelHidden(initialPanelHidden);

    let newInternalSettingsSnapshot: GodRaysSettings = {
      ...propsSettings, // Base from current props
      panelX: initialPanelX,
      panelY: initialPanelY,
      panelHidden: initialPanelHidden,
      devWireframe: propsSettings.devWireframe ?? false,
      devBoundingBoxes: propsSettings.devBoundingBoxes ?? false,
      devGizmos: propsSettings.devGizmos ?? false,
      devLogFps: propsSettings.devLogFps ?? false,
    };

    if (propsSettings.preset && PRESETS[propsSettings.preset]) {
      newInternalSettingsSnapshot = { 
        ...newInternalSettingsSnapshot, 
        ...PRESETS[propsSettings.preset], 
        preset: propsSettings.preset 
      };
    }
    setInternalSettings(newInternalSettingsSnapshot);

    const checkMobile = () => setIsMobileView(window.innerWidth < 480);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const params = new URLSearchParams(window.location.search);
    if (params.has('debug') && params.get('debug') === '1') {
      setIsDevMode(true);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []); // Runs once on mount

  // Sync `propsSettings` changes to `internalSettings` (excluding panel state which is locally managed)
  useEffect(() => {
    setInternalSettings(prevInternal => {
      const relevantPropsSettings = { ...propsSettings };
      delete relevantPropsSettings.panelX;
      delete relevantPropsSettings.panelY;
      delete relevantPropsSettings.panelHidden;
      
      let updatedSettings = {
        ...prevInternal,
        ...relevantPropsSettings, // Apply new props (e.g., exposure, decay from parent)
      };

      // If propsSettings.preset changes and is different from internal, apply it
      if (relevantPropsSettings.preset && relevantPropsSettings.preset !== prevInternal.preset && PRESETS[relevantPropsSettings.preset]) {
        updatedSettings = { ...updatedSettings, ...PRESETS[relevantPropsSettings.preset], preset: relevantPropsSettings.preset };
      } else if (!relevantPropsSettings.preset && prevInternal.preset && prevInternal.preset !== 'none') {
         // If prop clears preset, ensure internal reflects 'none' if it wasn't already custom.
        updatedSettings.preset = 'none';
      }
      
      // Ensure dev toggles are synced if they are in propsSettings
      if ('devWireframe' in relevantPropsSettings) updatedSettings.devWireframe = !!relevantPropsSettings.devWireframe;
      if ('devBoundingBoxes' in relevantPropsSettings) updatedSettings.devBoundingBoxes = !!relevantPropsSettings.devBoundingBoxes;
      if ('devGizmos' in relevantPropsSettings) updatedSettings.devGizmos = !!relevantPropsSettings.devGizmos;
      if ('devLogFps' in relevantPropsSettings) updatedSettings.devLogFps = !!relevantPropsSettings.devLogFps;

      return updatedSettings;
    });
  }, [propsSettings]); // Runs when `propsSettings` (the settings prop) changes.

  // When local `panelPosition` changes, save to localStorage & notify parent
  useEffect(() => {
    localStorage.setItem('godRaysPanelX', panelPosition.x.toString());
    localStorage.setItem('godRaysPanelY', panelPosition.y.toString());
    onSettingsChangeRef.current({ panelX: panelPosition.x, panelY: panelPosition.y });
    setInternalSettings(prev => ({...prev, panelX: panelPosition.x, panelY: panelPosition.y}));
  }, [panelPosition]);

  // When local `isPanelHidden` changes, save to localStorage & notify parent
  useEffect(() => {
    localStorage.setItem('godRaysPanelHidden', isPanelHidden.toString());
    onSettingsChangeRef.current({ panelHidden: isPanelHidden });
    setInternalSettings(prev => ({...prev, panelHidden: isPanelHidden}));
  }, [isPanelHidden]);
  
  // Drag handling effects (handleMouseDown, handleMouseMove, handleMouseUp, and their useEffect)
  // These are assumed to be correct from previous steps and primarily affect panelPosition.
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget && !((e.target as HTMLElement)?.closest('.panel-header-drag-handle'))) {
        return;
    }
    e.preventDefault(); 
    setIsDragging(true);
    const panelRect = panelRef.current?.getBoundingClientRect();
    if (panelRect) {
        dragStartRef.current = {
            x: e.clientX - panelRect.left,
            y: e.clientY - panelRect.top,
        };
    } else {
         dragStartRef.current = {
            x: e.clientX - panelPosition.x,
            y: e.clientY - panelPosition.y,
        };
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !panelRef.current) return;
    e.preventDefault(); 
    let newX = e.clientX - dragStartRef.current.x;
    let newY = e.clientY - dragStartRef.current.y;

    const panelRect = panelRef.current.getBoundingClientRect();
    newX = Math.max(0, Math.min(newX, window.innerWidth - panelRect.width));
    newY = Math.max(0, Math.min(newY, window.innerHeight - panelRect.height));

    setPanelPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  // End Drag handling effects

  const togglePanelHidden = () => {
    setIsPanelHidden(!isPanelHidden);
  };

  const toggleMobileSheet = () => {
    setIsMobileSheetOpen(!isMobileSheetOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | boolean;

    if (e.target instanceof HTMLInputElement && type === 'checkbox') {
      processedValue = e.target.checked;
    } else if (type === 'range' || type === 'number') {
      processedValue = parseFloat(value);
    } else {
      processedValue = value;
    }
    
    const newSettingUpdate = { 
      [name]: processedValue,
      preset: (name === 'preset' && processedValue !== 'none') ? processedValue as GodRaysSettings['preset'] : 'none'
    } as Partial<GodRaysSettings>; 

    setInternalSettings(prev => ({...prev, ...newSettingUpdate}));
    onSettingsChangeRef.current(newSettingUpdate);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSettingUpdate = { 
        lightColor: e.target.value,
        preset: 'none'
    } as Partial<GodRaysSettings>;
    setInternalSettings(prev => ({...prev, ...newSettingUpdate}));
    onSettingsChangeRef.current(newSettingUpdate);
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = e.target.value as keyof typeof PRESETS;
    let presetSettingsUpdate: Partial<GodRaysSettings>;

    if (presetName === 'none') {
        presetSettingsUpdate = { preset: 'none' };
    } else if (PRESETS[presetName]) {
      presetSettingsUpdate = { ...PRESETS[presetName], preset: presetName as GodRaysSettings['preset'] };
    } else {
      return; // Should not happen
    }
    setInternalSettings(prev => ({...prev, ...presetSettingsUpdate}));
    onSettingsChangeRef.current(presetSettingsUpdate);
  };
  
  const displaySettings = internalSettings;

  const renderControls = () => (
    <>
      <div className="mb-3">
        <label htmlFor="preset" className="block mb-1 font-medium">Preset</label>
        <select
          id="preset"
          name="preset"
          value={displaySettings.preset ?? 'none'}
          onChange={handlePresetChange}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-xs"
        >
          <option value="none">None (Custom)</option>
          <option value="soft">Soft Glow</option>
          <option value="cone">Cone Beam</option>
        </select>
        {displaySettings.preset && displaySettings.preset !== 'none' && (
            <p className="text-xxs text-cyan-400 mt-1">Active preset: {displaySettings.preset}. Modifying sliders will switch to custom.</p>
        )}
      </div>

      {isDevMode && (
        <CollapsibleSection title="Developer Settings" isOpenInitially={false}>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="devWireframe"
              name="devWireframe"
              checked={!!displaySettings.devWireframe}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
            />
            <label htmlFor="devWireframe" className="ml-2 font-medium">Wireframe</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="devBoundingBoxes"
              name="devBoundingBoxes"
              checked={!!displaySettings.devBoundingBoxes}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
            />
            <label htmlFor="devBoundingBoxes" className="ml-2 font-medium">Show Bounding Boxes</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="devGizmos"
              name="devGizmos"
              checked={!!displaySettings.devGizmos}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
            />
            <label htmlFor="devGizmos" className="ml-2 font-medium">Show Gizmos</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="devLogFps"
              name="devLogFps"
              checked={!!displaySettings.devLogFps}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
            />
            <label htmlFor="devLogFps" className="ml-2 font-medium">Log FPS</label>
          </div>
        </CollapsibleSection>
      )}

      <CollapsibleSection title="General Settings">
        <div>
          <label htmlFor="exposure" className="block mb-1 font-medium">Exposure: {displaySettings.exposure.toFixed(2)}</label>
          <input
            type="range"
            id="exposure"
            name="exposure"
            min="0"
            max="1"
            step="0.01"
            value={displaySettings.exposure}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="decay" className="block mb-1 font-medium">Decay: {displaySettings.decay.toFixed(2)}</label>
          <input
            type="range"
            id="decay"
            name="decay"
            min="0"
            max="1"
            step="0.01"
            value={displaySettings.decay}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="density" className="block mb-1 font-medium">Density: {displaySettings.density.toFixed(2)}</label>
          <input
            type="range"
            id="density"
            name="density"
            min="0"
            max="1"
            step="0.01"
            value={displaySettings.density}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="weight" className="block mb-1 font-medium">Weight: {displaySettings.weight.toFixed(2)}</label>
          <input
            type="range"
            id="weight"
            name="weight"
            min="0"
            max="1"
            step="0.01"
            value={displaySettings.weight}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="samples" className="block mb-1 font-medium">Samples: {displaySettings.samples}</label>
          <input
            type="range"
            id="samples"
            name="samples"
            min="10"
            max="300"
            step="10"
            value={displaySettings.samples}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="invert"
            name="invert"
            checked={!!displaySettings.invert}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
          />
          <label htmlFor="invert" className="ml-2 font-medium">Invert</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="enabled"
            name="enabled"
            checked={displaySettings.enabled ?? true}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
          />
          <label htmlFor="enabled" className="ml-2 font-medium">Enable Rays</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="animate"
            name="animate"
            checked={displaySettings.animate ?? false}
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
            value={displaySettings.lightColor}
            onChange={handleColorChange}
            className="w-full h-8 p-0 border-none rounded cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="colorIntensity" className="block mb-1 font-medium">Color Intensity: {displaySettings.colorIntensity?.toFixed(2) ?? '1.0'}</label>
          <input
            type="range"
            id="colorIntensity"
            name="colorIntensity"
            min="0"
            max="5"
            step="0.1"
            value={displaySettings.colorIntensity ?? 1}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="lightPositionX" className="block mb-1 font-medium">VLS Source X: {displaySettings.lightPositionX?.toFixed(1) ?? '0.0'}</label>
          <input
            type="range"
            id="lightPositionX"
            name="lightPositionX"
            min="-20"
            max="20"
            step="0.1"
            value={displaySettings.lightPositionX ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="lightPositionY" className="block mb-1 font-medium">VLS Source Y: {displaySettings.lightPositionY?.toFixed(1) ?? '0.0'}</label>
          <input
            type="range"
            id="lightPositionY"
            name="lightPositionY"
            min="-20"
            max="20"
            step="0.1"
            value={displaySettings.lightPositionY ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="lightPositionZ" className="block mb-1 font-medium">VLS Source Z: {displaySettings.lightPositionZ?.toFixed(1) ?? '0.0'}</label>
          <input
            type="range"
            id="lightPositionZ"
            name="lightPositionZ"
            min="-50"
            max="50"
            step="0.1"
            value={displaySettings.lightPositionZ ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Light Emitter Mesh Settings" isOpenInitially={false}>
        <div>
          <label htmlFor="lightShape" className="block mb-1 font-medium">Emitter Shape</label>
          <select
            id="lightShape"
            name="lightShape"
            value={displaySettings.lightShape ?? 'sphere'}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="sphere">Sphere</option>
            <option value="box">Box</option>
            <option value="plane">Plane</option>
          </select>
        </div>
        <div>
          <label htmlFor="meshRadius" className="block mb-1 font-medium">Emitter Mesh Radius: {displaySettings.meshRadius?.toFixed(2) ?? '0.50'}</label>
          <input
            type="range"
            id="meshRadius"
            name="meshRadius"
            min="0.05"
            max="5"
            step="0.05"
            value={displaySettings.meshRadius ?? 0.5}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="meshPositionX" className="block mb-1 font-medium">Emitter Mesh X: {displaySettings.meshPositionX?.toFixed(1) ?? '0.0'}</label>
          <input
            type="range"
            id="meshPositionX"
            name="meshPositionX"
            min="-20"
            max="20"
            step="0.1"
            value={displaySettings.meshPositionX ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="meshPositionY" className="block mb-1 font-medium">Emitter Mesh Y: {displaySettings.meshPositionY?.toFixed(1) ?? '0.0'}</label>
          <input
            type="range"
            id="meshPositionY"
            name="meshPositionY"
            min="-20"
            max="20"
            step="0.1"
            value={displaySettings.meshPositionY ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="meshPositionZ" className="block mb-1 font-medium">Emitter Mesh Z: {displaySettings.meshPositionZ?.toFixed(1) ?? '0.0'}</label>
          <input
            type="range"
            id="meshPositionZ"
            name="meshPositionZ"
            min="-20"
            max="20"
            step="0.1"
            value={displaySettings.meshPositionZ ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection title="Post-Processing & Effect Tuning" isOpenInitially={false}>
        <div>
          <label htmlFor="postProcessRatio" className="block mb-1 font-medium">Post Process Ratio: {displaySettings.postProcessRatio?.toFixed(2) ?? '0.2'}</label>
          <input
            type="range"
            id="postProcessRatio"
            name="postProcessRatio"
            min="0.1"
            max="1"
            step="0.1"
            value={displaySettings.postProcessRatio ?? 0.2}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="passRatio" className="block mb-1 font-medium">Pass Ratio: {displaySettings.passRatio?.toFixed(2) ?? '0.4'}</label>
          <input
            type="range"
            id="passRatio"
            name="passRatio"
            min="0.1"
            max="1"
            step="0.1"
            value={displaySettings.passRatio ?? 0.4}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="lightRadius" className="block mb-1 font-medium">VLS Effect Radius: {displaySettings.lightRadius?.toFixed(2) ?? '0.00'}</label>
          <input
            type="range"
            id="lightRadius"
            name="lightRadius"
            min="0.05"
            max="10"
            step="0.05"
            value={displaySettings.lightRadius ?? 0.5}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="blur" className="block mb-1 font-medium">Blur: {displaySettings.blur?.toFixed(2) ?? '0.00'}</label>
          <input
            type="range"
            id="blur"
            name="blur"
            min="0"
            max="0.99"
            step="0.01"
            value={displaySettings.blur ?? 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </CollapsibleSection>
    </>
  );


  if (isMobileView) {
    if (isMobileSheetOpen) {
      return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-95 text-white p-4 z-[1001] flex flex-col text-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">God Rays Controls</h3>
            <button onClick={toggleMobileSheet} className="text-gray-400 hover:text-white" aria-label="Close Controls">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto flex-grow space-y-3">
            {renderControls()}
          </div>
        </div>
      );
    }
    // Floating action button for mobile
    return (
      <button
        onClick={toggleMobileSheet}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-xl z-[1000] flex items-center justify-center"
        style={{ width: '56px', height: '56px' }}
        aria-label="Open Controls"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 1.655c.007.379.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 010-1.655c-.007-.379-.137-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    );
  }


  // Desktop Draggable Panel
  if (isPanelHidden) {
    return (
      <button
        onClick={togglePanelHidden}
        className="fixed bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full shadow-xl z-[1000]"
        style={{ 
            top: `${panelPosition.y}px`, 
            left: `${panelPosition.x}px`,
            width: '40px', // Small pill size
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
        aria-label="Show Controls"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 1.655c.007.379.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 010-1.655c-.007-.379-.137-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    );
  }

  return (
    <div 
      ref={panelRef}
      className="bg-gray-800 bg-opacity-90 text-white p-0 rounded-lg shadow-xl fixed z-[1000] w-80 text-xs max-h-[95vh] flex flex-col"
      style={{
        top: `${panelPosition.y}px`,
        left: `${panelPosition.x}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div 
        className="panel-header-drag-handle bg-gray-900 p-2 flex justify-between items-center rounded-t-lg cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <h3 className="text-base font-bold">God Rays Controls</h3>
        <button onClick={togglePanelHidden} className="text-gray-400 hover:text-white" aria-label="Hide Controls">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </button>
      </div>
      
      <div className="p-3 overflow-y-auto flex-grow space-y-3">
        {renderControls()}
      </div>
    </div>
  );
} 