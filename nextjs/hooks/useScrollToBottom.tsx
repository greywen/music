import { useEffect, useRef } from 'react';

type ScrollBottomHookProps = {
  handler: () => void;
  delay: number;
};

const useScrollToBottom = ({ handler, delay }: ScrollBottomHookProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastExecutedRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = containerRef.current;
      if (!current) return;

      const { scrollTop, scrollHeight, clientHeight } = current;

      if (Math.abs(scrollHeight - scrollTop - clientHeight) <= 1) {
        const now = Date.now();
        if (now - lastExecutedRef.current > delay) {
          handler();
          lastExecutedRef.current = now;
        }
      }
    };

    const element = containerRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handler, delay]);

  return containerRef;
};

export default useScrollToBottom;
