import { useState, useEffect } from "react";

const useCounterAnimation = (jumlah) => {
  const [counter, setCounter] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const animateCounter = () => {
      let start = 0;
      const end = jumlah;
      const duration = 4000; // 2 seconds animation duration
      const steps = 50; // How many steps in the animation
      const stepDuration = duration / steps;

      const stepInterval = setInterval(() => {
        start += Math.ceil(end / steps);
        if (start >= end) {
          start = end;
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsAnimating(true); // Start animating again after 2 seconds
          }, 2000); // Wait for 2 seconds before starting the next cycle
        }
        setCounter(start);
      }, stepDuration);
    };

    if (isAnimating) {
      animateCounter();
      setIsAnimating(false);
    }

    // Clean up the interval when the component is unmounted or updated
    return () => clearInterval();
  }, [isAnimating, jumlah]);

  return counter;
};

export default useCounterAnimation;