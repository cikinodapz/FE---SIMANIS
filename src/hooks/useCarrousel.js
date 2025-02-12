import { useState, useEffect } from "react";

const useCarousel = (imagesLength) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesLength);
    }, 3000); 

    return () => clearInterval(interval); // Clear interval saat komponen di-unmount
  }, [imagesLength]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesLength);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + imagesLength) % imagesLength
    );
  };

  return { currentIndex, handleNext, handlePrev };
};

export default useCarousel;