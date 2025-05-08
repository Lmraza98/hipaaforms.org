// components/BabylonGodRay.client.tsx
'use client'
import { useEffect, useRef } from 'react'
import * as BABYLON from '@babylonjs/core'
import '@babylonjs/core/PostProcesses/volumetricLightScatteringPostProcess'
import '@babylonjs/core/Meshes/meshBuilder'
import '@babylonjs/core/Materials/standardMaterial'

export default function BabylonGodRay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const engine = new BABYLON.Engine(canvasRef.current, true, {
      preserveDrawingBuffer: false,
      stencil: true,
      alpha: true
    })

    const w = engine.getRenderWidth();
    const h = engine.getRenderHeight();
    const margin = 50; // pixels from top
    const screenX = w / 2;
    const screenY = margin;

    const scene = new BABYLON.Scene(engine);

    // light sphere material
    const mat = new BABYLON.StandardMaterial('lightMat', scene)
    const lc = BABYLON.Color3.FromHexString('#002E70')
    mat.emissiveColor.set(lc.r, lc.g, lc.b)
    mat.disableLighting = false
    
    // clear to transparent, so you see the CSS background behind it
    const transparent = new BABYLON.Color4(0, 0, 0, 0);
    scene.clearColor = transparent
    scene.autoClear = false

    const bg = BABYLON.Color3.FromHexString('#000b1d')
    scene.clearColor = new BABYLON.Color4(bg.r, bg.g, bg.b, 1)
    
    const camera = new BABYLON.FreeCamera(
      'cam',
      new BABYLON.Vector3(0, 20, -30),
      scene,
    )

    camera.setTarget(BABYLON.Vector3.Zero())
    camera.fov = Math.PI / 12; 

    const lightSphere1 = BABYLON.MeshBuilder.CreateSphere(
      'lightMat',
      {  diameterX: .1, diameterY: .1, diameterZ: .1 },
      scene,
    )
    const lightSphere2 = BABYLON.MeshBuilder.CreateSphere(
      'lightMat',
      {  diameterX: .1, diameterY: .1, diameterZ: .05 },
      scene,
    )
    
    lightSphere1.material = mat
    lightSphere2.material = mat
   
    const vls1 = new BABYLON.VolumetricLightScatteringPostProcess(
      'vls1',
      { postProcessRatio: 4, passRatio: .05,  },
      camera,
      lightSphere1,
      300,
      BABYLON.Texture.TRILINEAR_SAMPLINGMODE,
      engine,
      false
    )
    // const vls2 = new BABYLON.VolumetricLightScatteringPostProcess(
    //   'vls2',
    //   { postProcessRatio: 4, passRatio: .5,  },
    //   camera,
    //   lightSphere2,
    //   300,
    //   BABYLON.Texture.TRILINEAR_SAMPLINGMODE,
    //   engine,
    //   false
    // )

    const rayStart1 = BABYLON.Vector3.Unproject(
      new BABYLON.Vector3(screenX + 400, screenY, 0),
      w, h,
      BABYLON.Matrix.Identity(),
      camera.getViewMatrix(),
      camera.getProjectionMatrix()
    );
    const rayEnd1 = BABYLON.Vector3.Unproject(
      new BABYLON.Vector3(screenX + 400, screenY, 1),
      w, h,
      BABYLON.Matrix.Identity(),
      camera.getViewMatrix(),
      camera.getProjectionMatrix()
    );
    // const rayStart2 = BABYLON.Vector3.Unproject(
    //   new BABYLON.Vector3(screenX*2, screenY + 200, 0),
    //   w, h,
    //   BABYLON.Matrix.Identity(),
    //   camera.getViewMatrix(),
    //   camera.getProjectionMatrix()
    // );
    // const rayEnd2 = BABYLON.Vector3.Unproject(
    //   new BABYLON.Vector3(screenX*2 - 25, screenY + 200, 1),
    //   w, h,
    //   BABYLON.Matrix.Identity(),
    //   camera.getViewMatrix(),
    //   camera.getProjectionMatrix()
    // );
    const direction1 = rayEnd1.subtract(rayStart1);
    // const direction2 = rayEnd2.subtract(rayStart2);

    if (Math.abs(direction1.z) > 1e-6) {
      const t = -rayStart1.z / direction1.z;
      const worldPos = rayStart1.add(direction1.scale(t));
      lightSphere1.position = worldPos;
    } else {
      console.warn("Ray is parallel to Z=0 plane.");
    }
    // if (Math.abs(direction2.z) > 1e-6) {
    //   const t = -rayStart2.z / direction2.z;
    //   const worldPos = rayStart2.add(direction2.scale(t));
    //   lightSphere2.position = worldPos;
    // } else {
    //   console.warn("Ray is parallel to Z=0 plane.");
    // }
    vls1.useCustomMeshPosition = true
  
    vls1.setCustomMeshPosition(new BABYLON.Vector3(10, 5, 5))
    vls1.exposure = 0.3    // less overall brightness
    vls1.decay = 1   // rays fall off faster
    vls1.density = 1    // fewer samples per pixel
    vls1.weight = 1    // less contribution per sample
    vls1.samples = 100
    vls1.invert = true;

    // vls2.useCustomMeshPosition = true
  
    // vls2.setCustomMeshPosition(new BABYLON.Vector3(10, 5, 5))
    // vls2.exposure = 0.3    // less overall brightness
    // vls2.decay = 1   // rays fall off faster
    // vls2.density = 1    // fewer samples per pixel
    // vls2.weight = 1    // less contribution per sample
    // vls2.samples = 100
    // vls2.invert = true;

    // const sphere = BABYLON.MeshBuilder.CreateBox("sphere", { height: 0.05, width: 0.05, depth: 0.05 }, scene);

    // // Assign a material with an emissive color
    // const material = new BABYLON.StandardMaterial("material", scene);
    
    // material.emissiveColor = lc// Orange glow
    // sphere.material = material;

    // // Calculate top-center position for the sphere (vls3's source)
    // const topMargin = 20; // Pixels from top for vls3 source
    // const sphereScreenX = w / 2;
    // const sphereScreenY = topMargin;

    // const rayStartSphere = BABYLON.Vector3.Unproject(
    //   new BABYLON.Vector3(sphereScreenX, sphereScreenY, 0),
    //   w, h,
    //   BABYLON.Matrix.Identity(),
    //   camera.getViewMatrix(),
    //   camera.getProjectionMatrix()
    // );
    // const rayEndSphere = BABYLON.Vector3.Unproject(
    //   new BABYLON.Vector3(sphereScreenX, sphereScreenY, 2),
    //   w, h,
    //   BABYLON.Matrix.Identity(),
    //   camera.getViewMatrix(),
    //   camera.getProjectionMatrix()
    // );
    // const directionSphere = rayEndSphere.subtract(rayStartSphere);
    // if (Math.abs(directionSphere.z) > 1e-6) {
    //   const t = -rayStartSphere.z / directionSphere.z; // Project to Z=0 plane
    //   sphere.position = rayStartSphere.add(directionSphere.scale(t));
    // } else {
    //   console.warn("Ray for sphere (vls3 source) is parallel to Z=0 plane. Defaulting position.");
    //   // Fallback position if projection is problematic, adjust X, Y, Z as needed relative to camera
    //   sphere.position = new BABYLON.Vector3(0, camera.position.y - 2, 10); 
    // }

    // // Create and configure the glow layer
    // const glowLayer = new BABYLON.GlowLayer("glow", scene);
    // glowLayer.intensity = .05; // Moderate brightness - Reduced
    // glowLayer.blurKernelSize = 8; // Soft, diffused glow
    
    // const vls3 = new BABYLON.VolumetricLightScatteringPostProcess(
    //   'vls3', // Corrected name from 'vls2'
    //   { postProcessRatio: .5, passRatio: 1 }, // Ratios can be tuned
    //   camera,
    //   sphere, // vls3 uses this sphere as its source
    //   100, // samples for the VLS process itself
    //   BABYLON.Texture.TRILINEAR_SAMPLINGMODE,
    //   engine,
    //   false
    // );
    // // Removed: vls3.setCustomMeshPosition(new BABYLON.Vector3(10, 5, 5))
    // // vls3 will use sphere.position by default.

    // vls3.exposure = .3;    // Overall brightness (0.0 to 1.0+) - Reduced
    // vls3.decay = 1;      // Stretched: Slower decay, longer rays (0.0-1.0, higher is slower decay)
    // vls3.density = 1;     // Dispersed: More rays, denser scattering (0.0-1.0) - Reduced
    // vls3.weight = 1;     // Dispersed: Contribution per sample (0.0-1.0), adjust for intensity - Reduced
    // vls3.samples = 100;     // Quality of god rays. Original 100.
    // vls3.invert = true; // Kept from original


    engine.runRenderLoop(() => {
      engine.clear(transparent, true, true)    // <-- clears to transparent black
      scene.render()    // <-- drives the vls1 post‐process
    })

    window.addEventListener('resize', () => engine.resize())
    return () => {
      window.removeEventListener('resize', () => engine.resize())
      engine.stopRenderLoop()
      scene.dispose()
      engine.dispose()
    }
  }, [])

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
