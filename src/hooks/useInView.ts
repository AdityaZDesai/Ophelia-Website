"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for detecting when an element enters the viewport
 * Used for scroll-triggered animations
 */
export function useInView(threshold = 0.1, rootMargin = "0px 0px -60px 0px") {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isInView };
}

