import { useEffect } from 'react';

export function useClickOutside(
  refs: React.RefObject<HTMLDivElement | null>[],
  handler: () => void,
  when: boolean = true
) {
  useEffect(() => {
    if (!when) return;
    const listener = (e: MouseEvent) => {
      if (refs.some(r => r.current?.contains(e.target as Node))) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [refs, handler, when]);
} 