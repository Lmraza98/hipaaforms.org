'use client'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface AnimatedGradientProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedGradient({ children, className }: AnimatedGradientProps) {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const [windowWidth, setWindowWidth] = useState(1000); // default fallback


  const rotation = useSpring(
    useTransform(mouseX, [0, windowWidth], [60, 30]),  // tighter diagonal, aiming closer to horizontal
    { stiffness: 100, damping: 20 }
  );

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX]);


  return (
    <div
      className={clsx('relative overflow-hidden isolate', className)}
      style={{
        // background: 'radial-gradient(circle 300px at top center, white 0%, transparent 100%)',
        // mixBlendMode: 'screen',
        // opacity: 0.3, // optional: control intensity

      }}
    >
      {/* Static radial gradient layer */}
      {/* <div 
       className={clsx('relative overflow-hidden isolate bottom-0', className)}
      style={{
        background: 'radial-gradient(circle 150px at top center, rgb(20,30,48) 0%, rgb(10,15,24) 100%)'
      }} /> */}


      {/* Noise texture overlay */}
 
      <div
        className="absolute inset-0 opacity-[0.05] z-0 pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABx0lEQVR42q2TzUvDUBCGv2ck0U1NUSrpzFvaBDYWcZBsZIkoYmpuFg6BOpSCXNQiE6VhY2JPEqKLS0aC1xs7EzsTHn5O75++59BExMzwnf/zPf+c/j1KwAVwBtK2N2S/OOqUTrMYS2IhBhF4VNUgEt4kXdc7SfpHDUuZ0SAshEm+0D1K5lcnvlRxSHgOYywxghvMZ3rHngZ81pVk2tWaE8nm1r0U6NgFtWAl9WLEuzyHZMJMDuwp7m0WZH+9I1Up7Oz6v1Kboi6qPgtBgQYVQuZGeP0F6uGE9vm9EZ8zN0QGtMWrltTtB5Kcbq0hLGPhypKf+WByQtAUMtZ2cB0Ol8kPkFMGL1XAtPMh0KMAlu3sk9Z6uHoSVQSQDs9sLjNGKrSN5yIo74cE+UCjcTeQCv0c9vBSvEmuYhvQn7fE+AXuJUBqQIoMl6KP8PUSl5Tyl9lfipWQCTuOY3UL/X7S9CpDF5pLS5BAAAAABJRU5ErkJggg==")',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* micro‑beam rig */}
      {!reduceMotion && (
        <div className="pointer-events-none absolute top-0 right-0 origin-right h-[500%] w-[20px] -translate-y-1/2 overflow-visible">
          {/* Halo - wide & soft */}
          <motion.div
            className="absolute inset-0 blur-[50px] mix-blend-screen"
            style={{
              background:
                'linear-gradient(to left, transparent, rgba(0,221,255,0.1) 50%, transparent)',
              rotate: rotation,
            }}
          />

          {/* Core - sharp & slightly diffused */}
          <motion.div
            className="absolute inset-0 w-[30%] mx-auto blur-[6px] mix-blend-screen"
            style={{
              background:
                'linear-gradient(to left, transparent, rgba(0,221,255,0.4) 50%, transparent)',
              rotate: rotation,
            }}
          />
        </div>
      )}
      {/* Content */}
      <div className="relative z-10 min-h-[100vh] flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
} 