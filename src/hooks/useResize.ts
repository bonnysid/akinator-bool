import { useEffect, useState } from 'react';

export const useResize = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const resize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return { width };
};
