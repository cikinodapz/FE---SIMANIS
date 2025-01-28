import { useState, useEffect } from 'react';

const useCountUp = (target) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;

    const animate = () => {
      if (current < target) {
        current++;
        setCount(current);
        requestAnimationFrame(animate); // Melakukan animasi dengan frame yang halus
      }
    };

    animate();
  }, [target]);

  return count;
};

export default useCountUp;
