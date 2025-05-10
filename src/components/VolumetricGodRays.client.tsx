// components/BabylonGodRay.client.tsx
'use client'
import { useEffect, useRef, useMemo } from 'react'
import * as BABYLON from '@babylonjs/core'
import '@babylonjs/core/PostProcesses/volumetricLightScatteringPostProcess'
import '@babylonjs/core/PostProcesses/blurPostProcess'
import '@babylonjs/core/Meshes/meshBuilder'
import '@babylonjs/core/Materials/standardMaterial'
import type { GodRaysSettings } from './GodRaysRemote.client';

// Define default settings, ensuring all properties from GodRaysSettings are covered
const defaultSettings: GodRaysSettings = {
  exposure: 0.3,
  decay: 1,
  density: 1,
  weight: 1,
  samples: 100,
  invert: false,
  lightColor: '#002E70',
  lightPositionX: 0,
  lightPositionY: 0,
  lightPositionZ: 5, // Default VLS source Z
  lightRadius: 0.5, // This is a general setting, VLS uses the mesh
  blur: 0, // General setting, not directly used by this VLS setup

  // Mesh specific settings
  meshPositionX: 0,
  meshPositionY: 0,
  meshPositionZ: 0, // Default mesh Z (relative to its coordinate system/parent)
  meshRadius: 0.1,
  lightShape: 'sphere',

  // Post-processing specific
  postProcessRatio: 0.2,
  passRatio: 0.4,

  // Control/UI related
  enabled: true, // Assuming default is enabled if component is rendered
  animate: false,
  colorIntensity: 1.0,
};

interface VolumetricGodRaysProps {
  settings?: Partial<GodRaysSettings>;
}

export default function VolumetricGodRays({ settings: propsSettings }: VolumetricGodRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blurPostProcessRef = useRef<BABYLON.BlurPostProcess | null>(null); // Ref for blur post-process

  // Merge and sanitize settings using useMemo
  const settings = useMemo<GodRaysSettings>(() => {
    // Start with defaults, then overlay with propsSettings. Props values might be undefined.
    const merged = { ...defaultSettings, ...(propsSettings || {}) }; 

    // Sanitize and ensure all properties are valid according to GodRaysSettings types
    for (const key of Object.keys(defaultSettings) as Array<keyof GodRaysSettings>) {
      const defaultValue = defaultSettings[key];
      const currentValue = merged[key]; // This will have type GodRaysSettings[keyof GodRaysSettings]

      if (typeof defaultValue === 'number') {
        if (currentValue === undefined || currentValue === null || isNaN(Number(currentValue))) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (merged as any)[key] = defaultValue; 
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (merged as any)[key] = Number(currentValue);
        }
      } else if (typeof defaultValue === 'boolean') {
        if (currentValue === undefined || currentValue === null) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (merged as any)[key] = defaultValue;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (merged as any)[key] = Boolean(currentValue);
        }
      } else if (typeof defaultValue === 'string') {
        if (currentValue === undefined || currentValue === null) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (merged as any)[key] = defaultValue;
        } else {
          const strValue = String(currentValue).trim();
          if (key === 'lightShape') {
            if (strValue === 'sphere' || strValue === 'box' || strValue === 'plane') {
              merged.lightShape = strValue;
            } else {
              merged.lightShape = defaultSettings.lightShape!; // Fallback to default if invalid string
            }
          } else if (key === 'lightColor' && strValue === '') {
            merged.lightColor = defaultSettings.lightColor!; // Fallback to default if empty
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (merged as any)[key] = strValue; 
          }
        }
      }
    }
    return merged as GodRaysSettings; // Assert final object conforms to GodRaysSettings
  }, [propsSettings]);


  useEffect(() => {
    if (!canvasRef.current) return

    const engine = new BABYLON.Engine(canvasRef.current, true, {
      preserveDrawingBuffer: false,
      stencil: true,
      alpha: true
    })

    const scene = new BABYLON.Scene(engine);
    const mat = new BABYLON.StandardMaterial('lightMat', scene)
    // Use sanitized settings.lightColor and settings.colorIntensity
    const baseColor = BABYLON.Color3.FromHexString(settings.lightColor);
    const emissiveColorWithIntensity = baseColor.scale(settings.colorIntensity!);
    mat.emissiveColor = emissiveColorWithIntensity;
    mat.disableLighting = false // Typically true for emissive-only objects if no external lights affect them

    const transparent = new BABYLON.Color4(0, 0, 0, 0);
    const bg = BABYLON.Color3.FromHexString('#000b1d') // Consider making this a setting if needed
    scene.clearColor = new BABYLON.Color4(bg.r, bg.g, bg.b, 1)
    
    const camera = new BABYLON.FreeCamera(
      'cam',
      new BABYLON.Vector3(0, 0, -50), // Initial camera Z position adjusted for typical view
      scene,
    )
    camera.setTarget(BABYLON.Vector3.Zero())
    
    // Light emitter mesh
    let lightEmitterMesh: BABYLON.Mesh;
    const meshRadius = settings.meshRadius!; // meshRadius is number after sanitization
    const meshDiameter = meshRadius * 2;

    if (settings.lightShape === 'box') {
      lightEmitterMesh = BABYLON.MeshBuilder.CreateBox('lightEmitter', { size: meshDiameter }, scene);
    } else if (settings.lightShape === 'plane') {
      // Plane needs a sourceNormal for VLS to work well if it's not facing camera.
      // For simplicity, assume it faces +Z or some consistent orientation.
      lightEmitterMesh = BABYLON.MeshBuilder.CreatePlane('lightEmitter', { size: meshDiameter }, scene);
      // lightEmitterMesh.rotation.x = Math.PI / 2; // Example: make it horizontal
    } else { // Default to 'sphere'
      lightEmitterMesh = BABYLON.MeshBuilder.CreateSphere('lightEmitter', { diameter: meshDiameter }, scene);
    }
    lightEmitterMesh.material = mat;
    // Set mesh visibility based on a potential setting, or keep it visible for VLS
    // lightEmitterMesh.isVisible = settings.meshVisible ?? true; // Example if 'meshVisible' was a setting

    const vls1 = new BABYLON.VolumetricLightScatteringPostProcess(
      'vls1',
      { // VLS PostProcessOptions, use sanitized settings
        postProcessRatio: settings.postProcessRatio!,
        passRatio: settings.passRatio!,
        invert: settings.invert!,
      },
      camera,
      lightEmitterMesh, // The mesh to cast rays from
      settings.samples!, // Quality samples, sanitized number
      BABYLON.Texture.TRILINEAR_SAMPLINGMODE,
      engine,
      false // reusable
    );

    vls1.exposure = settings.exposure!;
    vls1.decay = settings.decay!;
    vls1.density = settings.density!;
    vls1.weight = settings.weight!;
    // vls1.samples and vls1.invert are set in constructor options

    // Make the light emitter mesh non-pickable and disable bounding info sync
    // if it's just a visual source for VLS and not interactive.
    lightEmitterMesh.isPickable = false;
    lightEmitterMesh.doNotSyncBoundingInfo = true;

    function updateDynamicElements() {
      // const w = engine.getRenderWidth(); // w is not used

      if (window.innerWidth < 600) {
        camera.fov = Math.PI / 4;
      } else {
        camera.fov = Math.PI / 50; // Consider adjusting this FOV for larger screens
      }

      // Position the light-emitting MESH itself using sanitized settings
      lightEmitterMesh.position = new BABYLON.Vector3(
        settings.meshPositionX!,
        settings.meshPositionY!,
        settings.meshPositionZ!
      );

      // Set the custom source position for the Volumetric Light Scattering EFFECT
      // This can be different from the actual mesh's position, giving artistic control
      vls1.useCustomMeshPosition = true; // Crucial for setCustomMeshPosition to take effect
      vls1.setCustomMeshPosition(new BABYLON.Vector3(
        settings.lightPositionX!,
        settings.lightPositionY!,
        settings.lightPositionZ!
      ));

      vls1.useDiffuseColor = true; // False as default

      // Manage Blur PostProcess based on settings.blur
      if (settings.blur! > 0.001) { // Add blur if value is meaningful
        if (!blurPostProcessRef.current) {
          // Create blur post process (horizontal blur for simplicity)
          // The "kernel" parameter determines the strength of the blur.
          // Larger kernel sizes = more blur. Max is usually 64 or 128.
          // Direction is a Vector2, (1,0) for horizontal, (0,1) for vertical.
          // Options can be a number (ratio) or PostProcessOptions.
          blurPostProcessRef.current = new BABYLON.BlurPostProcess(
            "blur", 
            new BABYLON.Vector2(1, 0), // Horizontal blur
            settings.blur! * 64, // Kernel size - adjust multiplier as needed
            1.0, // Options - Post-process ratio
            camera, 
            BABYLON.Texture.BILINEAR_SAMPLINGMODE, 
            engine, 
            true // Reusable
          );
        } else {
          // Update existing blur kernel
          blurPostProcessRef.current.kernel = settings.blur! * 64; // Adjust multiplier as needed
        }
      } else { // If blur is 0 or very small, remove the blur effect
        if (blurPostProcessRef.current) {
          blurPostProcessRef.current.dispose(camera);
          blurPostProcessRef.current = null;
        }
      }
    }
    
    updateDynamicElements(); // Initial call

    engine.runRenderLoop(() => {
      if (settings.animate) { // Simple animation example if animate is true
        const time = performance.now() * 0.001;
        lightEmitterMesh.position.y = settings.meshPositionY! + Math.sin(time) * 0.5; // Animate mesh Y
        // Or animate VLS source position:
        // vls1.setCustomMeshPosition(new BABYLON.Vector3(settings.lightPositionX + Math.cos(time), settings.lightPositionY, settings.lightPositionZ));
      }
      engine.clear(transparent, true, true)
      scene.render()
    })

    const resizeHandler = () => {
      engine.resize()
      updateDynamicElements();
    }
    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
      engine.stopRenderLoop()
      
      if (blurPostProcessRef.current) { // Dispose blur on cleanup
        blurPostProcessRef.current.dispose(camera);
        blurPostProcessRef.current = null;
      }
      if (vls1) {
        vls1.dispose(camera);
      }
      if (lightEmitterMesh) { // Dispose the created mesh
        lightEmitterMesh.dispose();
      }
      if (mat) {
        mat.dispose();
      }
      
      scene.dispose(); // Dispose scene resources
      engine.dispose(); // Dispose engine
    }
  }, [settings]) // useEffect depends on the sanitized settings object

  // Apply developer settings that might affect the scene or engine globally
  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = BABYLON.Engine.LastCreatedEngine; // Get existing engine
    const scene = engine?.scenes[0]; // Get existing scene

    if (engine && scene) {
      // Wireframe
      if (settings.devWireframe) {
        scene.forceWireframe = true;
      } else {
        scene.forceWireframe = false;
      }

      // Bounding Boxes (example for lightEmitterMesh, assuming it exists and is accessible)
      // This needs to be handled more carefully if lightEmitterMesh is not always present
      // or if other meshes also need their bounding boxes toggled.
      // For now, this illustrates the concept. A more robust solution would manage mesh references.
      const lightEmitterMesh = scene.getMeshByName("lightEmitter");
      if (lightEmitterMesh) {
        lightEmitterMesh.showBoundingBox = !!settings.devBoundingBoxes;
      }

      // Gizmos (Placeholder - GizmoManager setup is more involved)
      // if (settings.devGizmos) {
      //   if (!scene.gizmoManager) {
      //     scene.gizmoManager = new BABYLON.GizmoManager(scene);
      //     scene.gizmoManager.positionGizmoEnabled = true;
      //     scene.gizmoManager.rotationGizmoEnabled = true;
      //     scene.gizmoManager.scaleGizmoEnabled = true;
      //     scene.gizmoManager.boundingBoxGizmoEnabled = true; 
      //   }
      //   if (lightEmitterMesh) {
      //     scene.gizmoManager.attachToMesh(lightEmitterMesh);
      //   }
      // } else {
      //   if (scene.gizmoManager) {
      //     scene.gizmoManager.dispose();
      //     (scene as any).gizmoManager = null; // Clear it
      //   }
      // }

      // Log FPS
      // This is a bit conceptual for a toggle; usually, you'd log it continuously or on demand.
      // A simple way to show FPS is to use the Inspector, but for programmatic logging:
      if (settings.devLogFps) {
        // This will log to console when devLogFps is true and settings change.
        // For continuous logging, you'd use scene.onBeforeRenderObservable or similar.
        console.log("Current FPS:", engine.getFps().toFixed(2));
      }
    }
  }, [settings.devWireframe, settings.devBoundingBoxes, settings.devGizmos, settings.devLogFps]); // Re-run if any dev setting changes

  return (
    <div
      className="w-full h-full flex items-start justify-start"
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  )
}
