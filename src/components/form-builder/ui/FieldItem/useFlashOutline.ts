import { useState, useEffect } from 'react';

export function useFlashOutline(justAdded: boolean, duration = 700) {
  const [show, setShow] = useState(justAdded);
  useEffect(() => {
    if (!justAdded) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(t);
  }, [justAdded, duration]);
  return show;
} 