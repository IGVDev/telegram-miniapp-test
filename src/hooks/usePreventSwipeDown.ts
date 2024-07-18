import { useEffect, useRef } from 'react';

export const usePreventSwipeDown = () => {
  const scrollableElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overflow = 100;
    document.body.style.overflowY = 'hidden';
    document.body.style.marginTop = `${overflow}px`;
    document.body.style.height = `${window.innerHeight + overflow}px`;
    document.body.style.paddingBottom = `${overflow}px`;
    window.scrollTo(0, overflow);

    let ts: number | undefined;

    const onTouchStart = (e: TouchEvent) => {
      ts = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const scrollableEl = scrollableElRef.current;
      if (scrollableEl) {
        const scroll = scrollableEl.scrollTop;
        const te = e.changedTouches[0].clientY;
        if (scroll > 0 || ts! > te) {
          return;
        }
      } else {
        e.preventDefault();
      }
    };

    document.documentElement.addEventListener('touchstart', onTouchStart, { passive: false });
    document.documentElement.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      document.documentElement.removeEventListener('touchstart', onTouchStart);
      document.documentElement.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return scrollableElRef;
};