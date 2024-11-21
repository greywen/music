import { useState, useEffect } from 'react';

function useImageLoader(src?: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    if (src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoaded(true);
      img.onerror = () => setLoaded(false);
    }
  }, [src]);

  return loaded;
}

export default useImageLoader;
